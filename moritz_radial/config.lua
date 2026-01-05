Config = {}

-- Taste fürs Öffnen (F1 = 249)
Config.OpenKey = 170

-- Hauptmenü-Buttons (je 400x400 PNG, runder Rahmen im Bild machen)
Config.MainMenu = {
    {
        id = "personal",
        label = "Personal",
        icon  = "img/main_personal.png"
    },
    {
        id = "job",
        label = "Job",
        icon  = "img/main_job.png"
    },
    {
        id = "vehicle",
        label = "Fahrzeug",
        icon  = "img/main_vehicle.png"
    },
    {
        id = "help",
        label = "Hilfe",
        icon  = "img/main_help.png"
    }
}

-- Vehicle Extras: Fahrzeuge, bei denen Extras-Menü VERBOTEN ist
-- Spawnnamen vom Fahrzeug hier rein
Config.ExtrasBlacklist = {
    "juspol",
    "jusrebla",
    "jodyssey",
    "ipol",
    "polrebla",
    "polhart",
    "jushart",
    "podyssey",
    "zmbrtourer",
    "bsfrtwgel",
    "ref",
    "ktwf",
    "pol_vorschlaghammer",
    "zargent",
    "zvertreter",
    "zmbrtourerpol",
    "zkanzlert",
    "zequator",
    "zbfam",
    "zargentpol"
}

-- Personal-Menü: für alle Spieler gleich
-- logo = 1000x1000 PNG, das in der Mitte vom Unterrad liegt
Config.PersonalMenu = {
    logo = "img/personal_logo.png",
    items = {
        {
            label   = "Jobmenu",
            command = "job",
            values  = {},
	    textRotation = 0
        },
        {
            label   = "   Brieftasche Ansehen",
            command = "wallet",
            values  = {},
	    textRotation = -90
        },
        {
            label   = "   PLZ Suche",
            command = "postal %value1",
            values  = { "PLZ" },
            textRotation = -90
        },
        {
            label   = "PLZ Entfernen     ",
            command = "postal",
            values  = {},
            textRotation = -90
        },
        {
            label   = "Hud Anpassen",
            command = "settings",
            values  = {},
            textRotation = 180
        },
        {
            label   = "Hud \nAusblenden",
            command = "togglehud",
            values  = {},
            textRotation = 180
        },
        {
            label   = "Streamer Modus",
            command = "streamermode",
            values  = {},
            textRotation = 90
        },
        {
            label   = "Emote Menu",
            command = "emotemenu",
            values  = {},
            textRotation = 90
        },
        {
            label   = "Dokumente",
            command = "dokument",
            values  = {},
            textRotation = 90
        },

    }
}

Config.VehicleMenu = {
    logo = "img/vehicle_logo.png",
    items = {
        {
            label   = "Extras",
            type    = "extras",
            icon    = "img/extras.png",
            maxExtras = 30,
	    textRotation = 0
        }
    }
}

Config.JobMenus = {
    ['unemployed'] = {
        logo = "img/unemployed.png",
   	items = {
        { label = "Zum Affen machen",      command = "hose",                      values = {},      jobs = {} },
    	}
    },
    ['police'] = {
        logo = "img/pol.png",
   	items = {
        { label = "Panic Button",      command = "panic",                      values = {},      jobs = {} },
        { label = "Fahrzeug Beschlagnahmen",        command = "impound",                    values = {},      jobs = {}, textRotation = -90 },
       	{ label = "Lizenz vergeben",  command = "givelicense %value1 %value2", values = { "id", "text" }, jobs = {},textRotation = -90 },
       	{ label = "Lizenz \n entziehen",  command = "revokelicense %value1 %value2", values = { "id", "text" }, jobs = {},textRotation = 180 },
        { label = "Gefaengnis Einweisung",        command = "jailmenu",                    values = {},      jobs = {},textRotation = 180 },
        { label = "Gefangenen Befreien",        command = "unjail",                    values = { "id" },      jobs = {},textRotation = 180 },
        { label = "Zone Erstellen",        command = "zoneerstellen",                    values = {},      jobs = {},textRotation = 90 },
        { label = "Zone Entfernen",        command = "zonerem",                    values = {},      jobs = {},textRotation = 90 }
    	}
    },
    ['security'] = {
        logo = "img/cita.png",
   	items = {
        { label = "Panic Button",      command = "panic",                      values = {},      jobs = {} },
        { label = "Fahrzeug Beschlagnahmen",        command = "impound",                    values = {},      jobs = {}, textRotation = -90 },
       	{ label = "Lizenz \n vergeben",  command = "givelicense %value1 %value2", values = { "id", "text" }, jobs = {}, textRotation = -90 },
       	{ label = "Lizenz \n entziehen",  command = "revokelicense %value1 %value2", values = { "id", "text" }, jobs = {}, textRotation = 180 },
        { label = "Zone Erstellen",        command = "zoneerstellen",                    values = {},      jobs = {},textRotation = 90 },
        { label = "Zone Entfernen",        command = "zonerem",                    values = {},      jobs = {},textRotation = 90 }

    	}
    },
    ['argn'] = {
        logo = "img/argn.png",
   	items = {
        { label = "Panic Button",      command = "panic",                      values = {},      jobs = {} },
        { label = "Fahrzeug \n Beschlagnahmen",        command = "impound",                    values = {},      jobs = {}, textRotation = 90 },
        { label = "Zone Erstellen",        command = "zoneerstellen",                    values = {},      jobs = {},textRotation = 180 },
        { label = "Zone Entfernen",        command = "zonerem",                    values = {},      jobs = {},textRotation = 90 }
    	}
    },
    ['justiz'] = {
        logo = "img/justiz.png",
   	items = {
        { label = "Panic Button",      command = "panic",                      values = {},      jobs = {} },
        { label = "Gefaengnis Einweisung",        command = "jailmenu",                    values = {},      jobs = {}, textRotation = -90 },
        { label = "Gefangenen Befreien",        command = "unjail",                    values = { "id" },      jobs = {}, textRotation = -90 },
       	{ label = "Lizenz \n entziehen",  command = "revokelicense %value1 %value2", values = { "id", "text" }, jobs = {}, textRotation = 180 },
       	{ label = "Lizenz \n vergeben",  command = "givelicense %value1 %value2", values = { "id", "text" }, jobs = {}, textRotation = 180 },
        { label = "Zone Erstellen",        command = "zoneerstellen",                    values = {},      jobs = {},textRotation = 90 },
        { label = "Zone Entfernen",        command = "zonerem",                    values = {},      jobs = {},textRotation = 90 }
    	}
    },
    ['gruen'] = {
        logo = "img/gruen.png",
   	items = {
        { label = "Adminmode",      command = "ad",                      values = {},      jobs = {} },
        { label = "Adminweste",      command = "aw",                      values = {},      jobs = {},textRotation = -90 },
        { label = "Outfit",        command = "moritzadminoutfit",                    values = {},      jobs = {},textRotation = -90 },
        { label = "Player Blips",        command = "moritzadminblips",                    values = {},      jobs = {},textRotation = -90 },
        { label = "No Clip",        command = "moritzadminnoclip",                    values = {},      jobs = {},textRotation = -90 },
       	{ label = "No Clip \n Speed: 1-4",  command = "moritzadminnoclipspeed %value1", values = { "id" }, jobs = {}, textRotation = 180 },
       	{ label = "Ghost Mode",  command = "moritzadminghost", jobs = {}, textRotation = 180 },
       	{ label = "Lizenz entziehen",  command = "revokelicense %value1 %value2", values = { "id", "text" }, jobs = {}, textRotation = 90 },
       	{ label = "Lizenz \n vergeben",  command = "givelicense %value1 %value2", values = { "id", "text" }, jobs = {}, textRotation = 90 },
        { label = "Zone Erstellen",        command = "zoneerstellen",                    values = {},      jobs = {},textRotation = 90 },
        { label = "Zone Entfernen",        command = "zonerem",                    values = {},      jobs = {},textRotation = 90 }
    	}
    },
    ['krankenhaus'] = {
        logo = "img/rdkh.png",
   	items = {
        { label = "Panic Button",      command = "panic",                      values = {},      jobs = {} },
        { label = "Liege Rausholen",      command = "stretcher",                      values = {},      jobs = {}, textRotation = -90 },
        { label = "Liegenmenu",        command = "stretchermenu",                    values = {},      jobs = {}, textRotation = -90 },
       	{ label = "Liege \n Einpacken",  command = "delstretcher", values = {}, jobs = {}, textRotation = 180 },
       	{ label = "Job \n Dokumente",  command = "dokument", values = {}, jobs = {}, textRotation = 180 },
        { label = "Zone Erstellen",        command = "zoneerstellen",                    values = {},      jobs = {},textRotation = 90 },
        { label = "Zone Entfernen",        command = "zonerem",                    values = {},      jobs = {},textRotation = 90 }
    	}
    },
    ['rd'] = {
        logo = "img/rdkh.png",
   	items = {
        { label = "Panic Button",      command = "panic",                      values = {},      jobs = {} },
        { label = "Liege Rausholen",      command = "stretcher",                      values = {},      jobs = {}, textRotation = -90 },
        { label = "Liegenmenu",        command = "stretchermenu",                    values = {},      jobs = {}, textRotation = -90 },
       	{ label = "Liege \n Einpacken",  command = "delstretcher", values = {}, jobs = {}, textRotation = 180 },
       	{ label = "Job \n Dokumente",  command = "dokument", values = {}, jobs = {}, textRotation = 180 },
        { label = "Zone Erstellen",        command = "zoneerstellen",                    values = {},      jobs = {},textRotation = 90 },
        { label = "Zone Entfernen",        command = "zonerem",                    values = {},      jobs = {},textRotation = 90 }
    	}
    }

}

-- Hilfe-Knopf unten rechts: einfach nur /hilfe + Menüs schließen
Config.HelpCommand = "hilfe"

-- Sicherheits-Whitelist: nur Commands aus Config dürfen über ExecuteCommand laufen
-- (also hier nix machen, Config reicht)
