local function export_mapblock(mb_pos, mb_manifest)
    minetest.log("action", "[export_mod] exporting mapblock " .. minetest.pos_to_string(mb_pos))
    local pos1 = vector.multiply(mb_pos, 16)
    local pos2 = vector.add(pos1, 15)

    local manip = minetest.get_voxel_manip()
    manip:read_from_map(pos1, pos2)

    local node_ids = manip:get_data()
    local param1 = manip:get_light_data()
    local param2 = manip:get_param2_data()
    assert(#node_ids == 4096)
    assert(#param1 == 4096)
    assert(#param2 == 4096)

    local node_mapping = {} -- name -> id

    local air_only = true
    local processed_nodeids = {} -- id -> bool

    -- process node-ids
    for _, nodeid in ipairs(node_ids) do
        if not processed_nodeids[nodeid] then
            local name = minetest.get_name_from_content_id(nodeid)
            node_mapping[name] = nodeid
            processed_nodeids[nodeid] = true
            if name ~= "air" then
                air_only = false
            end
        end
    end

    if air_only then
        return 0
    end

    local mapdata = {}
    for i=1,#node_ids do
        table.insert(mapdata, mtwebview.encode_uint16(node_ids[i]))
    end
    for i=1,#param1 do
        table.insert(mapdata, string.char(param1[i]))
    end
    for i=1,#param2 do
        table.insert(mapdata, string.char(param2[i]))
    end

    local mapdata_raw = table.concat(mapdata)
    local mapdata_compressed = minetest.compress(mapdata_raw, "deflate")

    local pos_str = minetest.pos_to_string(mb_pos)
    mb_manifest[pos_str] = true
    return mtwebview.export_json(
        mtwebview.basepath .. "/mapblocks/" .. pos_str .. ".json", {
            node_mapping = node_mapping,
            mapdata = minetest.encode_base64(mapdata_compressed)
        }
    )
end

function mtwebview.export_map(mb_pos1, mb_pos2)
    local size, count = 0, 0
    local manifest = {
        mapblocks = {},
        min = vector.multiply(mb_pos1, 16),
        max = vector.multiply(mb_pos2, 16)
    }

    minetest.mkdir(mtwebview.basepath .. "/mapblocks")

    for x=mb_pos1.x,mb_pos2.x do
        for y=mb_pos1.y,mb_pos2.y do
            for z=mb_pos1.z,mb_pos2.z do
                local pos = {x=x, y=y, z=z}
                local mbsize = export_mapblock(pos, manifest.mapblocks)
                size = size + mbsize
                if mbsize > 0 then
                    count = count + 1
                end
            end
        end
    end

    mtwebview.export_json(mtwebview.basepath .. "/mapblocks/manifest.json", manifest, true)
    print("[mtwebview] exported " .. count .. " mapblocks (" .. size .. " bytes)")
end