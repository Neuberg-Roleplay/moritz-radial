local ESX
local isOpen = false
local currentJob = nil
local lastExtraItem = nil

CreateThread(function()
    while not ESX do
        if exports['es_extended'] ~= nil then
            ESX = exports['es_extended']:getSharedObject()
        else
            TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)
        end
        Wait(100)
    end

    local pdata = ESX.GetPlayerData()
    if pdata and pdata.job then
        currentJob = pdata.job.name
    end
end)

RegisterNetEvent('esx:setJob', function(job)
    currentJob = job.name
end)

-- Command so ausführen, als würde der Spieler es selber in den Chat schreiben
RegisterNetEvent('moritz_radial:runCommand', function(cmd)
    if not cmd or cmd == "" then return end
    -- NICHT anfassen, kein Slash hinzufügen, nix:
    -- wenn du "panic" in der Config hast, wird genau "panic" ausgeführt
    -- wenn du "/handsup" reinschreibst, wird genau "/handsup" ausgeführt
    ExecuteCommand(cmd)
end)

-- ===== Menü öffnen / schließen =====

local function OpenMainRadial()
    if isOpen then return end
    isOpen = true
    SetNuiFocus(true, true)

    SendNuiMessage(json.encode({
        action      = "openMain",
        mainButtons = Config.MainMenu
    }))
end

local function CloseRadial()
    if not isOpen then return end
    isOpen = false
    SetNuiFocus(false, false)

    SendNuiMessage(json.encode({ action = "closeAll" }))
end

local function ToggleRadial()
    if isOpen then CloseRadial() else OpenMainRadial() end
end

-- Taste f3 (170)
CreateThread(function()
    while true do
        Wait(0)
        if IsControlJustPressed(0, 170) then
            ToggleRadial()
        end
    end
end)

-- ===== NUI Callbacks =====

RegisterNUICallback("close", function(_, cb)
    CloseRadial()
    cb("ok")
end)

RegisterNUICallback("openMenu", function(data, cb)
    local menuId = data.menuId
    if menuId == "personal" then
        openPersonalMenu()
    elseif menuId == "vehicle" then
        openVehicleMenu()
    elseif menuId == "help" then
        TriggerServerEvent('moritz_radial:runHelp')
        CloseRadial()
    elseif menuId == "job" then
        openJobMenu()
    end
    cb("ok")
end)

RegisterNUICallback("selectSlice", function(data, cb)
    local menuType = data.menuType
    local index    = data.index

    if menuType == "vehicle" then
        local item = Config.VehicleMenu.items[index]
        if item and item.type == "extras" then
            openExtrasMenu(item)
            cb("ok")
            return
        end
    end

    local item
    if menuType == "personal" then
        item = Config.PersonalMenu.items[index]
    elseif menuType == "vehicle" then
        item = Config.VehicleMenu.items[index]
    elseif menuType == "job" then
        local jobCfg = Config.JobMenus[currentJob]
        if jobCfg then item = jobCfg.items[index] end
    end

    if not item then cb("ok") return end

    if item.values and #item.values > 0 then
        SendNuiMessage(json.encode({
            action   = "openInputs",
            menuType = menuType,
            index    = index,
            fields   = item.values
        }))
    else
        TriggerServerEvent('moritz_radial:executeItem', menuType, currentJob, index, {})
        CloseRadial()
    end

    cb("ok")
end)

RegisterNUICallback("cancelInputs", function(data, cb)
    local menuType = data.menuType
    if menuType == "personal" then
        openPersonalMenu()
    elseif menuType == "vehicle" then
        openVehicleMenu()
    elseif menuType == "job" then
        openJobMenu()
    end
    cb("ok")
end)

RegisterNUICallback("submitInputs", function(data, cb)
    local menuType = data.menuType
    local index    = data.index
    local valuesIn = data.values or {}

    -- baue saubere Liste 1..n
    local values = {}
    for k, v in pairs(valuesIn) do
        local num = tonumber(k)
        if num then
            values[num] = tostring(v or "")
        end
    end

    -- ID check (wenn value1 eine Zahl sein soll)
    if values[1] and values[1] ~= "" and not tonumber(values[1]) then
        ESX.ShowNotification("~r~ID muss eine Zahl sein.")
        cb("error")
        return
    end

    TriggerServerEvent('moritz_radial:executeItem', menuType, currentJob, index, values)
    CloseRadial()
    cb("ok")
end)

RegisterNUICallback("toggleExtra", function(data, cb)
    local extraId = data.idx
    local ped = PlayerPedId()
    local veh = GetVehiclePedIsIn(ped, false)

    if veh ~= 0 then
        local on = IsVehicleExtraTurnedOn(veh, extraId) == 1
        SetVehicleExtra(veh, extraId, on and 1 or 0)
    end

    if lastExtraItem then
        openExtrasMenu(lastExtraItem)
    end

    cb("ok")
end)

-- ===== Untermenüs =====

function openPersonalMenu()
    local items = {}
    for i, item in ipairs(Config.PersonalMenu.items) do
        items[#items+1] = {
            index       = i,
            label       = item.label,
            needsInput  = (item.values and #item.values > 0) or false,
            rotation    = item.textRotation or 0
        }
    end

    SendNuiMessage(json.encode({
        action   = "openSub",
        menuType = "personal",
        logo     = Config.PersonalMenu.logo,
        items    = items
    }))
end

function openVehicleMenu()
    local items = {}
    for i, item in ipairs(Config.VehicleMenu.items) do
    items[#items+1] = {
        index       = i,
        label       = item.label,
        type        = item.type or "command",
        needsInput  = (item.values and #item.values > 0) or false,
        rotation    = item.textRotation or 0
    }
    end

    SendNuiMessage(json.encode({
        action   = "openSub",
        menuType = "vehicle",
        logo     = Config.VehicleMenu.logo,
        items    = items
    }))
end

function openJobMenu()
    local jobCfg

    if currentJob and Config.JobMenus[currentJob] then
        jobCfg = Config.JobMenus[currentJob]
    else
        jobCfg = Config.JobMenus["unemployed"]
    end

    if not jobCfg then
        ESX.ShowNotification("~r~Kein Job-Menü konfiguriert.")
        return
    end

    local items = {}
    for i, item in ipairs(jobCfg.items) do
    items[#items+1] = {
        index       = i,
        label       = item.label,
        needsInput  = (item.values and #item.values > 0) or false,
        rotation    = item.textRotation or 0
    }
    end

    SendNuiMessage(json.encode({
        action   = "openSub",
        menuType = "job",
        logo     = jobCfg.logo,
        items    = items
    }))
end

function openExtrasMenu(extraItem)
    local ped = PlayerPedId()
    local veh = GetVehiclePedIsIn(ped, false)
    if veh == 0 then
        ESX.ShowNotification("~r~Du sitzt in keinem Fahrzeug.")
        return
    end

    local model = GetEntityModel(veh)
    if Config.ExtrasBlacklist then
        for _, name in ipairs(Config.ExtrasBlacklist) do
            if model == GetHashKey(name) then
                ESX.ShowNotification("~r~Für dieses Fahrzeug sind Extras deaktiviert.")
                return
            end
        end
    end

    lastExtraItem = extraItem

    local maxExtras = extraItem.maxExtras or 30
    local extras = {}

    for i = 1, maxExtras do
        if DoesExtraExist(veh, i) then
            local on = IsVehicleExtraTurnedOn(veh, i) == 1
            extras[#extras+1] = {
                idx   = i,
                label = ("Extra %d (%s)"):format(i, on and "ON" or "OFF")
            }
        end
    end

    if #extras == 0 then
        ESX.ShowNotification("~r~Dieses Fahrzeug hat keine Extras.")
        return
    end

    SendNuiMessage(json.encode({
        action = "openExtras",
        logo   = extraItem.icon or "img/extras.png",
        extras = extras
    }))
end
