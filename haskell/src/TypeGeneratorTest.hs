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


  


-- v :: Inne
-- v = VCemail "email_z_inne"

-- d :: Kontaktowe
-- d = Kontaktowe v "telefon_zKontaktowe"


-- instance A.ToJSON Inne where
--  parseJSON (VCemail x) = A.parseJSON x
--  parseJSON (VCinne x ) = A.parseJSON x

-- instance A.ToJSON Dane where
  

-- data Inne = VCemail String | VCinne String



-- data Kontaktowe = Kontaktowe {inne :: Inne, telefon :: String}
-- data Osobowe = Osobowe {adres :: String, imie :: String}
-- data Dane = VCkontaktowe Kontaktowe | VCosobowe Osobowe
-- data Emptyarr = Emptyarr {rasa :: String}
-- data Kluczemptyobj = Kluczemptyobj {gatunek :: String}
-- data Nazwatypu
--     = Nazwatypu {dane :: Dane,
--                  emptyArr :: ([Emptyarr]),
--                  hello :: ([String]),
--                  info :: String,
--                  kluczEmptyObj :: Kluczemptyobj}






instance LavaValue Kontaktowe where
  lavaWrite x = ("",A.object [
    ("inne" <> (fst $ lavaWrite (inne x)))
          A..= (snd $ lavaWrite (inne x)),
    ("telefon" <> (fst $ lavaWrite (telefon x)))
        A..= (snd $ lavaWrite (telefon x))
      
    ])

instance LavaValue Inne where
  lavaWrite (VCemail x) = ("_email", snd (lavaWrite x))
  lavaWrite (VCtelefon x) = ("_telefon", snd (lavaWrite x))

instance LavaValue Dane where
  lavaWrite (VCkontaktowe x) = ("_kontaktowe", snd (lavaWrite x))
  lavaWrite (VCosobowe x) = ("_osobowe", snd (lavaWrite x))

instance LavaValue Nazwatypu where
  lavaWrite x = ("",A.object [
    ("dane" <> (fst $ lavaWrite (dane x)))
          A..= (snd $ lavaWrite (dane x)),
    ("emptyArr" <> (fst $ lavaWrite (emptyArr x)))
          A..= (snd $ lavaWrite (emptyArr x)),
    ("hello" <> (fst $ lavaWrite (hello x)))
          A..= (snd $ lavaWrite (hello x)),
    ("info" <> (fst $ lavaWrite (info x)))
          A..= (snd $ lavaWrite (info x)),
    ("kluczEmptyObj" <> (fst $ lavaWrite (kluczEmptyObj x)))
          A..= (snd $ lavaWrite (kluczEmptyObj x))
    ])

instance LavaValue Osobowe where
  lavaWrite x = ("", A.object [
    ("adres" <> (fst $ lavaWrite (adres x)))
          A..= (snd $ lavaWrite (adres x)),
    ("imie" <> (fst $ lavaWrite (imie x)))
          A..= (snd $ lavaWrite (imie x))])

instance LavaValue Emptyarr where
  lavaWrite x = ("", A.object [
    ("rasa" <> (fst $ lavaWrite (rasa x)))
          A..= (snd $ lavaWrite (rasa x))
    ])
  
instance LavaValue Kluczemptyobj where
  lavaWrite x = ("", A.object [
   ("gantunek" <> (fst $ lavaWrite (gatunek x)))
          A..= (snd $ lavaWrite (gatunek x))
    ])


