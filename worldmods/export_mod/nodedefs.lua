
function mtwebview.export_nodedefs()
    local count = 0
    local nodedefs = {}

    for name, def in pairs(minetest.registered_nodes) do
        count = count + 1
        nodedefs[name] = {
            name = name,
            drawtype = def.drawtype,
            paramtype = def.paramtype,
            paramtype2 = def.paramtype2,
            light_source = def.light_source,
            mesh = def.mesh,
            tiles = def.tiles
        }
    end

    local size = mtwebview.export_json(mtwebview.basepath .. "/nodedefs.json", nodedefs, true)

    print("[mtwebview] exported " .. count .. " node-definitions (" .. size .. " bytes)")
end