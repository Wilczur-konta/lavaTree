{-# LANGUAGE UndecidableInstances #-}
{-# LANGUAGE TupleSections #-}
{-# LANGUAGE TypeSynonymInstances #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE InstanceSigs #-}
{-# LANGUAGE FlexibleContexts #-}
{-# LANGUAGE TemplateHaskell #-}

{-# LANGUAGE QuasiQuotes, OverloadedStrings #-}
{-# LANGUAGE DeriveAnyClass #-}
{-# LANGUAGE DerivingStrategies #-}
{-# LANGUAGE DataKinds #-}
{-# LANGUAGE DeriveGeneric #-}
{-# LANGUAGE TypeApplications #-}
{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE ScopedTypeVariables #-}

module Lib where

import Language.Haskell.TH 
import Data.Char
import qualified Data.Map as M
import qualified Data.Vector as V
import Data.Maybe

import Data.Aeson as A
import Data.ByteString
import Data.Aeson.Encode.Pretty as AP
import Data.Aeson.Types
import qualified Data.HashMap.Strict as HM   


import qualified Data.ByteString.Lazy as B
import Data.Text as T
import GHC.Generics
import Data.Map.Internal.Debug as AA
import qualified Data.Text.Lazy.Encoding as DTE
import qualified Data.Text.Lazy as TL
import NeatInterpolation (text)




data LAtom = LAString | LANumber | LABool deriving (Show)

type LVariants = M.Map Text LSchema 

type LObject = M.Map Text (Either LSchema LVariants)  

data LSchema = LSAtomic LAtom | LSObject LObject | LSArray LSchema deriving (Show)



instance ToJSON LSchema where
  toJSON (LSAtomic LAString) = "String"
  toJSON (LSAtomic LANumber) = "Number"
  toJSON (LSAtomic LABool) = "Boolean"
  toJSON (LSArray l) = (toJSON [l])
  toJSON (LSObject o) =
     toJSON $ M.fromList $  h <$> (M.toList o) 

    where
      h :: (Text , (Either LSchema LVariants)) -> (Text , Value)
      h (k , (Left x)) = (k , toJSON x)
      h (k , (Right y)) = (k <> "__v" , (toJSON y))



instance FromJSON LSchema  where

  parseJSON (String x ) =
    case x of
      "String" ->pure $  LSAtomic LAString
      "Number" -> pure $ LSAtomic LANumber
      "Boolean"-> pure $ LSAtomic  LABool
      _        -> typeMismatch "Not lavatree Atom Value" (String x)

  parseJSON (Array a )
      | V.length a /= 1 =
          typeMismatch
            "Only arrays with one element allowed in LTreSchema"
            (Array a)
      | otherwise = LSArray <$>( parseJSON (V.head a)) :: Parser LSchema


  parseJSON (Object x) =
    LSObject <$> M.fromList <$> (h' (HM.toList x)) :: Parser LSchema   
    where
      
      decodeFieldLabel :: Text -> Either Text Text
      decodeFieldLabel t
         | T.unpack (T.takeEnd 3 t) == "__v" = Right (T.dropEnd 3 t) 
         | otherwise = Left t
    
      fieldP :: Text -> Either (Text , Value -> Parser LSchema)
                               (Text, Value -> Parser LVariants)
      fieldP t =
        case decodeFieldLabel t of
          Left l  -> Left (l, parseJSON)  
          Right r -> Right (r , parseLVariants)

            where
              parseLVariants :: Value -> Parser LVariants
              parseLVariants (Object x) = M.fromList <$> h
                  where
                    h :: Parser [(Text, LSchema)]
                    h = HM.toList <$> traverse parseJSON x 
              parseLVariants x =
                typeMismatch "Only object is allowed as variant specification" x

     
 

      h' :: [(Text, Value)] -> Parser [(Text, Either LSchema LVariants)]
      h' = traverse (\(t , v) ->
                        case fieldP t of
                          Left (t',l) -> ((t',) . Left) <$> l v
                          Right (t',r) -> ((t',) . Right) <$> r v
                       )

-- TODO zamiast T.Text da?? (Maybe T.Text)

class LavaValue a where
  -- lavaSchema :: a -> LSchema
  lavaWrite  :: a ->  (T.Text, A.Value)
  lavaRead :: (T.Text, A.Value) -> A.Result a    

instance {-# OVERLAPPING #-} LavaValue String where
  -- lavaSchema _ = LSAtomic LAString
  lavaRead (_, x) = A.fromJSON x
  lavaWrite x = ("", A.toJSON x )

instance LavaValue Int where
  -- lavaSchema _ = LSAtomic LANumber
  lavaRead (_, x) = A.fromJSON x
  lavaWrite x = ("", A.toJSON x )

instance LavaValue Bool where
  -- lavaSchema _ = LSAtomic LABool
  lavaRead (_, x) = A.fromJSON x
  lavaWrite x = ("", A.toJSON x )

instance {-# OVERLAPPING #-} LavaValue a => LavaValue [a] where
  -- lavaSchema _ = LSAtomic LABool
  lavaRead (_, x) = do
    (l ::  [A.Value]) <- A.fromJSON (x :: A.Value)  
    mapM (\y -> lavaRead ("", y)) l

  lavaWrite x = ("", A.toJSON ((snd . lavaWrite) <$> x) )
                
-- ta funckja gwarantuje, ??e lista kluczy w mapie obiektu b??dzie zawsze taka sama bo przerzcuca zmienn?? cz?????? warto??ci klucza dla wariantu do warto??ci.
valueObjectHelper :: HM.HashMap T.Text a -> HM.HashMap T.Text (T.Text, a)
valueObjectHelper =
   HM.fromList .
   (fmap (\(k  , v) ->
       let [k' , vk] = T.splitOn (T.pack "_") k
       in (k', (T.pack "_" <> vk,v)) ))
   . HM.toList



-- ____________EXAMPLES_______________
-- ###################################




schemaTest1 :: LSchema
schemaTest1 = LSObject (M.fromList [("dane", Left (LSAtomic LAString))
                          ,("wariant", Right (M.fromList[("v1", LSAtomic LAString)
                                                        , ("v2", LSAtomic LANumber)
                                                        ]))])

schemaTest2 :: LSchema
schemaTest2 =
   LSObject (M.fromList
             [ ("imie",Left (LSAtomic LAString ))
             , ("wiek", Left (LSAtomic LANumber))
             , ("daneOsobowe", (Left (LSObject $
                      M.fromList [ ("pesel", Left (LSAtomic LAString))
                                 , ("daneSluzbowe", Right (M.fromList [
                                        ("cywil" , LSAtomic LAString  )                                                   ,("funkcjonariusz" , (LSAtomic LAString))
                                        ]))])))])
                                                    
                                                                                   
   




lts :: LSchema
lts = LSObject (M.fromList [
                   ("1", Left (LSObject (M.fromList [
                                            ("testCase1",(Left (LSObject (M.fromList [
  ("ubrania", Right (M.fromList[("sportowe", LSAtomic LAString)
                                  ,("eleganckie",LSAtomic LAString )
                                  ]))
 ,("buty", Right (M.fromList[("eleganckie",LSAtomic LAString )
                               ]))
                                                               
 ,("cechy", Left (LSArray (LSAtomic LAString)) )
 ,("wyglad", Left (LSArray (LSAtomic LAString)))
 ,("pusty", Left (LSObject (M.fromList [("dane", Left (LSAtomic LAString))
                                       ,("dane2", Left (LSAtomic LAString))
                                       ,("dane3", Left (LSAtomic LAString)) 
                                       ])))
 ,("imie",  Left (LSAtomic LAString))
 ,("klucz",  Left (LSAtomic LAString))
 ,("info",  Left (LSAtomic LAString))
 ,("info2",  Left (LSAtomic LAString))
 ,("age",  Left (LSAtomic LANumber))
 ,("age2", Left (LSAtomic LANumber))
 ,("isFemale",  Left (LSAtomic LABool))
 ,("isMale",  Left (LSAtomic LABool))
 ,("isFemale2",  Left (LSAtomic LABool))
 ,("isMale2",  Left (LSAtomic LABool))
 ,("sideBar",Left (LSObject (M.fromList [("visibility",Left (LSAtomic LABool))
                                         ])))
 ,("container", Left (LSObject (M.fromList[("companyList",Left(LSArray (LSObject (M.fromList[("id", Left (LSAtomic LANumber))
              ,("name", Left (LSAtomic LAString))
              ,("address", Left (LSAtomic LAString)) 
              ,("nip", Left (LSAtomic LANumber))
              ,("inne", Left (LSObject (M.fromList [("inne",Left (LSAtomic LAString
                                                                 ))])))]))))])))
 
        ]))))] )))            
                  ,("testCase2", Left (LSObject (M.fromList
                                                 [
                                            ("sidebar",Left (LSObject (M.fromList [
                                            ("visibility", Left (LSAtomic LABool))                                                                             ])))])))])





exampleLavaSchema :: B.ByteString
exampleLavaSchema =
  DTE.encodeUtf8 $ TL.fromStrict  $ [text|

{ "emptyArr": [{"rasa": "String"}],
  "hello": ["String"],
  "info":"String",
  "kluczEmptyObj": {"gatunek": "String"},
  "dane__v": {
    "osobowe": {
      "imie": "String",
      "adres": "String"
    },
    "kontaktowe": {
      "telefon": "String",
      "inne__v": {
        "email":"String",
        "inne": "String"
      }
    }
  }
}
 |]





  

l :: B.ByteString
l =
  DTE.encodeUtf8 $ TL.fromStrict  $ [text|

{ "emptyArr": [{"rasa": "String"}],
  "hello": ["String"],
  "info":"String",
  "kluczEmptyObj": {"gatunek": "String"},
  "dane__v": {
    "osobowe": {
      "imie": "String",
      "adres": "String"
    },
    "kontaktowe": {
      "telefon": "String",
      "inne__v": {
        "email":"String",
        "telefon": "String"
      }
    }
  }
}
 |]  
  
--  (eitherDecode exampleLavaSchema1) :: (Either String LSchema)

  
exampleLavaSchema1 :: B.ByteString
exampleLavaSchema1 =
  DTE.encodeUtf8 $ TL.fromStrict  $ [text|

{ "emptyArr":[ "String"],
  "hello": "String",
  "info":"String",
  "kluczEmptyObj": [{"gatunek": "String"}],
  "dane": {
    "osobowe": {
      "imie": "String",
      "adres": "String"
    },
    "kontaktowe": {
      "telefon": "String",
      "inne": {
        "email":"String"
      }
   } 
  }
}
 |]

lavaSchema1 :: B.ByteString
lavaSchema1 =
  DTE.encodeUtf8 $ TL.fromStrict  $ [text|
{
      "telefon": "String",
      "inne": {
        "email":"String"
      }
   } 
  
 |]

lavaSchemaKontakt :: LSchema
lavaSchemaKontakt = fromJust ((A.decode lavaSchema1) :: Maybe LSchema)
  
testl1 :: IO ()
testl1 =  B.putStr  $ A.encode $  fromJust ((A.decode l1) :: Maybe LSchema)

testl :: IO ()
testl =  B.putStr $ A.encode $  fromJust ((A.decode l) :: Maybe LSchema)

l1 :: B.ByteString
l1 =
  DTE.encodeUtf8 $ TL.fromStrict  $ [text|

{ "emptyArr":[ "String"],
  "hello": "String",
  "info":"String",
  "kluczEmptyObj": [{"gatunek": "String"}],
  "dane": {
    "osobowe": {
      "imie": "String",
      "adres": "String"
    },
    "kontaktowe": {
      "telefon": "String",
      "inne": {
        "email":"String"
      }
   } 
  }
}
 |]  
  


els1 :: B.ByteString
els1 =
  DTE.encodeUtf8 $ TL.fromStrict  $ [text|

[[[{"key":"String"}]]]

 |]
