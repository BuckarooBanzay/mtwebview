local function export_mapblock(mb_pos, manifest)
    local pos1 = vector.multiply(mb_pos, 16)
    local pos2 = vector.add(pos1, 15)

    local manip = minetest.get_voxel_manip()
    manip:read_from_map(pos1, pos2)

    local data = {
        node_ids = manip:get_data(),
        param1 = manip:get_light_data(),
        param2 = manip:get_param2_data(),
        node_mapping = {} -- name -> id
    }

    local air_only = true
    local processed_nodeids = {} -- id -> bool

    for _, nodeid in ipairs(data.node_ids) do
        if not processed_nodeids[nodeid] then
            local name = minetest.get_name_from_content_id(nodeid)
            data.node_mapping[name] = nodeid
            processed_nodeids[nodeid] = true
            if name ~= "air" then
                air_only = false
            end
        end
    end

    if air_only then
        return 0
    else
        local pos_str = minetest.pos_to_string(mb_pos)
        manifest[pos_str] = true
        return mtwebview.export_json(
            mtwebview.basepath .. "/mapblocks/" .. pos_str .. ".json",
            data
        )
    end
end

function mtwebview.export_map(mb_pos1, mb_pos2)
    local size, count = 0, 0
    local manifest = {}

    minetest.mkdir(mtwebview.basepath .. "/mapblocks")

    for x=mb_pos1.x,mb_pos2.x do
        for y=mb_pos1.y,mb_pos2.y do
            for z=mb_pos1.z,mb_pos2.z do
                local pos = {x=x, y=y, z=z}
                local mbsize = export_mapblock(pos, manifest)
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