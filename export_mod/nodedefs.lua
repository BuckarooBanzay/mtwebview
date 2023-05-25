
local function normalize_tiledef(def)
    if type(def) == "string" then
        return {
            name = def
        }
    elseif type(def) == "table" then
        return def
    else
        error("unknown tiledef type: " .. type(def))
    end
end

local exported_drawtypes = {
    ["normal"] = true,
    ["liquid"] = true,
    ["flowingliquid"] = true,
    ["glasslike"] = true,
    ["glasslike_framed"] = true,
    ["glasslike_framed_optional"] = true,
    ["allfaces"] = true,
    ["allfaces_optional"] = true,
    ["mesh"] = true
}

function mtwebview.export_nodedefs()
    local count = 0
    local nodedefs = {}

    for name, def in pairs(minetest.registered_nodes) do
        if exported_drawtypes[def.drawtype] then
            local entry = {
                name = name,
                id = minetest.get_content_id(name),
                drawtype = def.drawtype,
                paramtype = def.paramtype,
                paramtype2 = def.paramtype2,
                light_source = def.light_source,
                mesh = def.mesh,
                tiles = {}
            }

            for i=1,6 do
                if i == 1 or def.tiles[i] then
                    table.insert(entry.tiles, normalize_tiledef(def.tiles[i]))
                else
                    table.insert(entry.tiles, entry.tiles[i-1])
                end
            end

            count = count + 1
            table.insert(nodedefs, entry)
        end
    end

    local size = mtwebview.export_json(mtwebview.basepath .. "/nodedefs.json", nodedefs, true)

    print("[mtwebview] exported " .. count .. " node-definitions (" .. size .. " bytes)")
end