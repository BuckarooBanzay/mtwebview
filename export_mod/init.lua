mtwebview = {
    basepath = minetest.get_worldpath() .. "/mtwebview"
}

local MP = minetest.get_modpath("mtwebview")
dofile(MP .. "/common.lua")
dofile(MP .. "/nodedefs.lua")
dofile(MP .. "/textures.lua")

minetest.register_on_mods_loaded(function()
    minetest.after(1, function()
        minetest.mkdir(mtwebview.basepath)
        mtwebview.export_nodedefs()
        mtwebview.export_textures()
        minetest.request_shutdown("done")
    end)
end)