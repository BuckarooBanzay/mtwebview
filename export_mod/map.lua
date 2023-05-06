local air_cid = minetest.get_content_id("air")

local function export_mapblock(mb_pos, node_mapping, manifest)
    local pos1 = vector.multiply(mb_pos, 16)
    local pos2 = vector.add(pos1, 15)

    local manip = minetest.get_voxel_manip()
    manip:read_from_map(pos1, pos2)

    local data = {
        node_ids = manip:get_data(),
        param1 = manip:get_light_data(),
        param2 = manip:get_param2_data()
    }

    assert(#data.node_ids == 4096)
    assert(#data.param1 == 4096)
    assert(#data.param2 == 4096)

    local air_only = true

    for i=1,4096 do
        local nodeid = data.node_ids[i]
        if not node_mapping[nodeid] then
            node_mapping[nodeid] = minetest.get_name_from_content_id(nodeid)
        end
        if air_only and nodeid ~= air_cid then
            air_only = false
        end
    end

    if air_only then
        return 0
    else
        local pos_str = minetest.pos_to_string(mb_pos)
        table.insert(manifest, {
            filename = pos_str .. ".json",
            pos = mb_pos
        })
        return mtwebview.export_json(
            mtwebview.basepath .. "/mapblocks/" .. pos_str .. ".json",
            data
        )
    end
end

function mtwebview.export_map(mb_pos1, mb_pos2)
    local size, count = 0, 0
    local node_mapping = {}
    local manifest = {}

    minetest.mkdir(mtwebview.basepath .. "/mapblocks")

    for x=mb_pos1.x,mb_pos2.x do
        for y=mb_pos1.y,mb_pos2.y do
            for z=mb_pos1.z,mb_pos2.z do
                local pos = {x=x, y=y, z=z}
                size = size + export_mapblock(pos, node_mapping, manifest)
                count = count + 1
            end
        end
    end

    local reverse_node_mapping = {}
    for id, name in pairs(node_mapping) do
        reverse_node_mapping[name] = id
    end
    mtwebview.export_json(mtwebview.basepath .. "/node_mapping.json", reverse_node_mapping, true)
    mtwebview.export_json(mtwebview.basepath .. "/manifest.json", manifest, true)

    print("[mtwebview] exported " .. count .. " mapblocks (" .. size .. " bytes)")
end