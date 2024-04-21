function mtwebview.export_nodedefs()
    local count = 0
    local nodedefs = {}

    for name, def in pairs(minetest.registered_nodes) do
        count = count + 1
        local exported_def = {
            name = name,
            drawtype = def.drawtype,
            paramtype = def.paramtype,
            paramtype2 = def.paramtype2,
            light_source = def.light_source,
            mesh = def.mesh,
            tiles = def.tiles,
            node_box = def.node_box,
            connects_to = def.connects_to,
            groups = def.groups
        }

        if def.drawtype == "liquid" or def.drawtype == "flowingliquid" then
            exported_def.post_effect_color = def.post_effect_color
        end

        nodedefs[name] = exported_def
    end

    local size = mtwebview.export_json(mtwebview.basepath .. "/nodedefs.json", nodedefs, true)

    print("[mtwebview] exported " .. count .. " node-definitions (" .. size .. " bytes)")
end