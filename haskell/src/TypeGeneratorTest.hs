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


import Lib
import TypeGenerator
import Language.Haskell.TH
import qualified  Data.Aeson.Types as AT 


import qualified Data.Text as T
import Control.Monad

import qualified  Data.Aeson as A

$(testQD)
-- $(testQF)
-- $(testQT)


  
-- d :: Inne
-- d = Inne "jakas inna informacja"

-- k :: Kontaktowe
-- k = Kontaktowe d "80203049"
