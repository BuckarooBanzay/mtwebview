
function mtwebview.export_nodedefs()
    local count = 0
    local nodedefs = {}

    print(dump(minetest.registered_nodes["default:stone"]))

    for name, def in pairs(minetest.registered_nodes) do
        if not def.drawtype or def.drawtype == "normal" then
            local entry = {
                name = name,
                drawtype = def.drawtype,
                tiles = {def.tiles[1]}
                -- TODO
            }

            for i=2,6 do
                if def.tiles[i] then
                    table.insert(entry.tiles, def.tiles[i])
                else
                    table.insert(entry.tiles, entry.tiles[i-1])
                end
            end

            count = count + 1
            table.insert(nodedefs, entry)
        end
    end

    local size = mtwebview.export_json(mtwebview.basepath .. "/nodedefs.json", nodedefs)

    print("[mtwebview] exported " .. count .. " node-definitions (" .. size .. " bytes)")
end