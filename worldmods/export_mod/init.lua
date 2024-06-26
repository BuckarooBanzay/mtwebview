mtwebview = {
    basepath = minetest.get_worldpath() .. "/mtwebview"
}

local MP = minetest.get_modpath("mtwebview")
dofile(MP .. "/common.lua")
dofile(MP .. "/encoding.lua")
dofile(MP .. "/nodedefs.lua")
dofile(MP .. "/textures.lua")
dofile(MP .. "/export.lua")
dofile(MP .. "/map.lua")

local mb_pos1 = vector.new(-10, -2, -10)
local mb_pos2 = vector.new(10, 3, 10)

if minetest.settings:get_bool("export_mod_autoexport") then
    minetest.register_on_mods_loaded(function()
        minetest.after(1, function()
            minetest.mkdir(mtwebview.basepath)
            mtwebview.export_nodedefs()
            mtwebview.export_textures()

            local pos1 = vector.multiply(mb_pos1, 16)
            local pos2 = vector.multiply(mb_pos2, 16)
            minetest.emerge_area(pos1, pos2, function(_, _, calls_remaining)
                if calls_remaining == 0 then
                    --mtwebview.load_schematic({x=-30, y=-30, z=-30})
                    mtwebview.export_map(mb_pos1, mb_pos2)
                    minetest.request_shutdown("done")
                end
            end)

        end)
    end)
end