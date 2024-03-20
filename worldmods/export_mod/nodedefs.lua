
function mtwebview.export_nodedefs()
    local count = 0
    local nodedefs = {}

    for name, def in pairs(minetest.registered_nodes) do
        local entry = {
            name = name,
            id = minetest.get_content_id(name),
            drawtype = def.drawtype,
            paramtype = def.paramtype,
            paramtype2 = def.paramtype2,
            light_source = def.light_source,
            mesh = def.mesh,
            tiles = def.tiles
        }

        count = count + 1
        nodedefs[name] = entry
    end

    local size = mtwebview.export_json(mtwebview.basepath .. "/nodedefs.json", nodedefs, true)

    print("[mtwebview] exported " .. count .. " node-definitions (" .. size .. " bytes)")
end