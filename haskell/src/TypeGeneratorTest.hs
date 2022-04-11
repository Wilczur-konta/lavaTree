{-# LANGUAGE TypeSynonymInstances #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE InstanceSigs #-}
{-# LANGUAGE FlexibleContexts #-}
{-# LANGUAGE TemplateHaskell #-}

{-# LANGUAGE QuasiQuotes, OverloadedStrings #-}
{-# LANGUAGE DeriveAnyClass #-}
{-# LANGUAGE DerivingStrategies #-}
{-# LANGUAGE DeriveGeneric #-}
{-# LANGUAGE TypeApplications #-}
{-# LANGUAGE FlexibleInstances #-}

module TypeGeneratorTest where

import TypeGenerator
import Language.Haskell.TH
import qualified  Data.Aeson.Types as AT 


import qualified Data.Text as T
import Control.Monad

import qualified  Data.Aeson as A

$(testQD)
$(testQI)


instance A.ToJSON Inne where
  toJSON x  =
    A.object
    [
     "email" A..= email x
    ]



instance A.ToJSON Kontaktowe where
  toJSON x =
    A.object
    [
      "inne" A..= (A.toJSON (inne x))
    , "telefon" A..= A.toJSON (telefon x)
    ]
  
d :: Inne
d = Inne "jakas inna informacja"

k :: Kontaktowe
k = Kontaktowe d "80203049"
