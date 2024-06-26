
function mtwebview.export_textures()
    local count = 0
    local size = 0

    local destination_path = mtwebview.basepath .. "/media"
    minetest.mkdir(destination_path)

    for _, modname in ipairs(minetest.get_modnames()) do
        local modpath = minetest.get_modpath(modname)

        if modpath then
            for _, foldername in ipairs({"textures", "models"}) do
                local texturepath = modpath .. "/" .. foldername
                local dir_list = minetest.get_dir_list(texturepath)
                for _, filename in pairs(dir_list) do
                    count = count + 1
                    size = size + mtwebview.copyfile(
                        texturepath .. "/" .. filename, destination_path .. "/" .. filename
                    )
                end
            end
        end
    end
    print("[mtwebview] exported " .. count .. " textures (" .. size .. " bytes)")
end
