function mtwebview.load_schematic(pos)

    local f = io.open(minetest.get_modpath("mtwebview") .. "/testschematic.we")
    assert(f)
    local value = f:read("*all")
    f:close()

    minetest.log("info", "[mtwebview] loading test schematic")
    worldedit.deserialize(pos, value)
end