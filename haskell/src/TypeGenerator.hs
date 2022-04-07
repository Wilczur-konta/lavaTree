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

module TypeGenerator where

import Lib
import qualified Data.Text as T
import Control.Monad

import qualified  Data.Aeson as A
-- import Data.ByteString
-- import Data.Aeson.Encode.Pretty as AP
import qualified  Data.Aeson.Types as AT 

import qualified Data.Text.Lazy.Encoding as DTE
import qualified Data.Text.Lazy as TL
import qualified Data.ByteString.Lazy as B
import NeatInterpolation (text)

import Language.Haskell.TH

import Data.Monoid

import qualified Data.Map as M

-- data KluczEmptyObj =
--   KluczEmptyObj
--   { gatunek :: String
--   }

-- instance AT.FromJSON KluczEmptyObj where
--   parseJSON (A.Object x) =
--     case y of
--       Nothing -> undefined
--       Just x  -> pure x

--    where
--      y :: Maybe KluczEmptyObj
--      y = do
--        v0 <- (join  (AT.parseMaybe (\xx -> xx A..:? (T.pack "gatunek")) x))
--        return $ KluczEmptyObj v0

    
--     -- case toListKluczEmptyObj <$> undefined
  



-- data Osobowe =
--   Osobowe
--   { imie :: String
--   , adres :: String
--   } deriving Show

-- instance AT.FromJSON Osobowe where
--   parseJSON (A.Object x) =
--     case y of
--       Nothing -> undefined
--       Just x  -> pure x

--    where
--      y :: Maybe Osobowe
--      y = do
--        v0 <- (join  (AT.parseMaybe (\xx -> xx A..:? (T.pack "imie")) x))
--        v1 <- (join  (AT.parseMaybe (\xx -> xx A..:? (T.pack "adres")) x))
--        return $ Osobowe v0 v1


-- exam1 :: B.ByteString
-- exam1 =
--   DTE.encodeUtf8 $ TL.fromStrict  $ [text|
--  {
--    "imie" : "Krystian",
--    "adres" : "Stalowa"
--    }
-- |]  








-- data Inne =
--   Inne
--   { email :: String
--   }

-- data Kontaktowe =
--   Kontaktowe
--   { telefon :: String
--   , inne :: Inne
--   }

-- data Dane =
--   Dane
--   { osobowe :: ()
--   , kontaktowe :: ()
--   }
 
-- data NazwaTypu =
--   NazwaTypu
--     { emptyArr :: [String]
--     , hello :: String
--     , info :: String
--     , kluczEmptyObject :: [KluczEmptyObj]
--     , dane :: ()
--     }
             


genDepDefs :: T.Text -> LSchema ->  ([Dec],[Dec])
genDepDefs t s =
      case s of
        LSAtomic _ -> ([],[])
        LSObject m -> mconcat $ map (\(k,Left v) -> genLSchemaDef k v) $ M.toList m 
        LSArray a  -> genLSchemaDef t a  


genLSchemaDef :: T.Text -> LSchema -> ([Dec],[Dec])
genLSchemaDef name s =
  genDepDefs name s <> genActDef
    
  where
    genTypeName :: T.Text -> LSchema -> Type
    genTypeName t s =
      case s of
        LSAtomic a ->
          case a of
            LAString -> ConT (mkName "String")
            LANumber -> ConT (mkName "Int")
            LABool   -> ConT (mkName "Bool")
            
        LSObject _ -> ConT (mkName $ T.unpack $ T.toTitle t)
        LSArray o  -> AppT ListT (genTypeName t o)   

    
    b :: Bang
    b = Bang NoSourceUnpackedness NoSourceStrictness
      
    genConst :: M.Map T.Text (Either LSchema LVariants) -> Con
    genConst m =
      RecC (mkName $ T.unpack $ T.toTitle  name) $
      fmap
        (\(k,Left v)->
            ((mkName $ T.unpack k )
            , b
            ,genTypeName k v )
        ) $ M.toList m  

    genActDef :: ([Dec],[Dec])
    genActDef =
        case s of
           LSAtomic _ -> ([],[])
           LSObject m ->
             ([DataD []
                (mkName (T.unpack $ T.toTitle name))
                [] Nothing [genConst m] []]
             , [fromJsonInstanceDec m])
           LSArray _ -> ([],[])

       where
        fromJsonInstanceDec :: LObject -> Dec
        fromJsonInstanceDec m = InstanceD Nothing []
          (AppT (ConT(mkName "A.FromJSON"))
          (ConT(mkName (T.unpack(T.toTitle name)))))
          [ FunD (mkName "parseJSON")
          [Clause [ConP (mkName "A.Object") [VarP (mkName "x")]]
           (NormalB b) [
              FunD (mkName "y")
               [Clause []
               (NormalB doexp) [] 
               ]

                       ]]]
            where
              b :: Exp
              b = CaseE  (VarE (mkName "y"))
                  [Match (ConP (mkName "Nothing") [] )
                   (NormalB $ VarE (mkName "undefined")) [],
                   Match (ConP (mkName "Just") [VarP (mkName "x")] )
                   (NormalB $ (AppE (VarE (mkName "pure") ) (VarE (mkName "x"))) ) []
                  ]

              doexp :: Exp
              doexp = DoE (fieldsS ++
                            [NoBindS (AppE (VarE $ mkName "return") returnS)])

                where
                  
                  fieldsN :: [String]
                  fieldsN = fmap T.unpack $ M.keys m
                  
                  fieldsA :: [(Exp,Stmt)]
                  fieldsA =
                    [let nm' = mkName $ "v" ++ show i
                     in (VarE nm',
                         BindS (VarP nm') $
                           AppE ( VarE (mkName "join"))
                           (AppE (AppE ( VarE (mkName "AT.parseMaybe"))
                            ( LamE [(VarP $ mkName "xx")]
                              (InfixE
                               (Just (VarE $ mkName "xx"))
                               (VarE (mkName "A..:?"))
                               (Just (AppE (VarE $ mkName "T.pack")
                                     (LitE (StringL nm))))
                              )
                            ))
                            (VarE $ mkName "x")
                            )
                           
                         ) 
                    | (i, nm)<- zip ([0..]) (fieldsN)]

     -- v0 <- (join  (AT.parseMaybe (\xx -> xx A..:? (T.pack "imie")) x))

                  fieldsS :: [Stmt]
                  fieldsS = snd $ unzip fieldsA 

                  returnS :: Exp
                  returnS = foldl AppE (ConE (mkName $ T.unpack $ T.toTitle  name))
                  
                                  $ fst $ unzip fieldsA
                    -- AppE (VarE $ mkName "return")
                    -- (VarE $ mkName "v0")

              -- [BindS (VarP (mkName "v0"))
              --              (LitE (StringL "v0"))
              --             ,NoBindS (AppE (mkName ) )
              --             ]
 




-- instance AT.FromJSON Osobowe where
--   parseJSON (A.Object x) =
--     case y of
--       Nothing -> undefined
--       Just x  -> pure x

--    where
--      y :: Maybe Osobowe
--      y = do
--        v0 <- (join  (AT.parseMaybe (\xx -> xx A..:? (T.pack "imie")) x))
--        v1 <- (join  (AT.parseMaybe (\xx -> xx A..:? (T.pack "adres")) x))
--        return $ Osobowe v0 v1







      

test :: IO ()
test = do
  case (A.eitherDecode exampleLavaSchema1) of
    Left x -> putStrLn x
    Right x ->
      do putStrLn $ pprint $ fst $ genLSchemaDef "NazwaTypu" x
         putStrLn $ pprint $ snd $ genLSchemaDef "NazwaTypu" x


testQD :: Q [Dec]
testQD = return $
  case (A.eitherDecode exampleLavaSchema1) of
    Left x ->  []
    Right x -> fst $ genLSchemaDef "NazwaTypu" x


testQI :: Q [Dec]
testQI = return $
  case (A.eitherDecode exampleLavaSchema1) of
    Left x ->  []
    Right x -> snd $ genLSchemaDef "NazwaTypu" x


-- { "emptyArr":[ "String"],
--   "hello": "String",
--   "info":"String",
--   "kluczEmptyObj": [{"gatunek": "String"}],
--   "dane": {
--     "osobowe": {
--       "imie": "String",
--       "adres": "String"
--     },
--     "kontaktowe": {
--       "telefon": "String",
--       "inne": {
--         "email":"String",
--       }
--     }
--   }
-- }
--  |]  
