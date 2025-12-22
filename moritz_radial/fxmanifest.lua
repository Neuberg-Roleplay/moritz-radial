fx_version 'cerulean'
game 'gta5'

author 'Moritz'
description 'Komplexes Radialmenü (Personal / Vehicle / Job / Hilfe / Extras)'
version '1.1.0'

ui_page 'html/index.html'

files {
    'html/index.html',
    'html/style.css',
    'html/app.js',
    'html/img/*.png'
}

shared_scripts {
    'config.lua'
}

client_scripts {
    'client.lua'
}

server_scripts {
    -- '@mysql-async/lib/MySQL.lua', -- falls nicht benutzt, raus
    'server.lua'
}
