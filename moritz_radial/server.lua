local ESX

CreateThread(function()
    if exports['es_extended'] ~= nil then
        ESX = exports['es_extended']:getSharedObject()
    else
        TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)
    end
end)

local function PlayerHasJob(xPlayer, allowedJobs)
    if not allowedJobs or #allowedJobs == 0 then
        return true
    end
    for _, j in ipairs(allowedJobs) do
        if xPlayer.job and xPlayer.job.name == j then
            return true
        end
    end
    return false
end

local function buildCommand(item, values)
    if not item or not item.command then return nil end

    local cmd    = item.command
    local vals   = values or {}
    local usedPH = false

    -- Platzhalter ersetzen
    if cmd:find("%%value1") then
        cmd    = cmd:gsub("%%value1", vals[1] or "")
        usedPH = true
    end
    if cmd:find("%%value2") then
        cmd    = cmd:gsub("%%value2", vals[2] or "")
        usedPH = true
    end
    if cmd:find("%%value3") then
        cmd    = cmd:gsub("%%value3", vals[3] or "")
        usedPH = true
    end

    -- Wenn KEIN %valueX benutzt wurde ? altes Verhalten: Werte hinten anhängen
    if not usedPH and #vals > 0 then
        for _, v in ipairs(vals) do
            if v ~= "" then
                cmd = cmd .. " " .. v
            end
        end
    end

    -- Whitespace aufräumen
    cmd = cmd:gsub("%s+", " ")
             :gsub("^%s+", "")
             :gsub("%s+$", "")

    print(("[radial] built command: %s"):format(cmd)) -- Debug, kannst du später löschen

    return cmd
end

local function getItemByPath(menuType, jobName, index)
    if menuType == "personal" then
        return Config.PersonalMenu.items[index]
    elseif menuType == "vehicle" then
        return Config.VehicleMenu.items[index]
    elseif menuType == "job" then
        local jobCfg = Config.JobMenus[jobName]
        if not jobCfg then return nil end
        return jobCfg.items[index]
    end
    return nil
end

RegisterNetEvent('moritz_radial:executeItem', function(menuType, jobName, index, values)
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    if not xPlayer then return end

    local item = getItemByPath(menuType, jobName, index)
    if not item then return end

    if not PlayerHasJob(xPlayer, item.jobs) then
        return
    end

    if item.type == "extras" then
        return
    end

    local cmd = buildCommand(item, values)
    print(("[radial] built command: %s"):format(cmd))
    if not cmd or cmd == "" then return end

    TriggerClientEvent('moritz_radial:runCommand', src, cmd)
end)

RegisterNetEvent('moritz_radial:runHelp', function()
    local src = source
    local cmd = Config.HelpCommand or "hilfe"
    TriggerClientEvent('moritz_radial:runCommand', src, cmd)
end)
