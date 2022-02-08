{-# LANGUAGE TypeSynonymInstances #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE InstanceSigs #-}
{-# LANGUAGE FlexibleContexts #-}
{-# LANGUAGE TemplateHaskell #-}

{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE DeriveAnyClass #-}
{-# LANGUAGE DerivingStrategies #-}
{-# LANGUAGE DataKinds #-}
{-# LANGUAGE DeriveGeneric #-}
{-# LANGUAGE TypeApplications #-}
{-# LANGUAGE FlexibleInstances #-}

module Lib where

import Language.Haskell.TH 
import Data.Char
import qualified Data.Map as M
import Data.Aeson as A
import Data.ByteString
import qualified Data.ByteString.Lazy as B
import Data.Text as T
import GHC.Generics
import Data.Map.Internal.Debug as AA

data LAtom = LAString | LANumber | LABool deriving (Show)

type LVariants = M.Map Text LSchema 

type LObject = M.Map Text (Either LSchema LVariants)  

data LSchema = LSAtomic LAtom | LSObject LObject | LSArray LSchema deriving (Show)


instance ToJSON LAtom where
  toJSON :: LAtom -> Value
  toJSON LAString = "String"
  toJSON LANumber = "Number"
  toJSON LABool = "Boolean"


instance ToJSON LSchema where
  toJSON :: LSchema -> Value
  toJSON (LSAtomic a) = toJSON a
  toJSON (LSArray l) = toJSON [l]
  toJSON (LSObject o) =
     toJSON $ M.fromList $  h <$> (M.toList o) 

    where
      h :: (Text , (Either LSchema LVariants)) -> (Text , Value)
      h (k , (Left x)) = (k , toJSON x)
      h (k , (Right y)) = (k <> "__v" , (toJSON y))


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
















