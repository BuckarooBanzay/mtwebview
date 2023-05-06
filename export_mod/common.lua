function mtwebview.copyfile(src, target)
	local infile = io.open(src, "rb")
	local instr = infile:read("*a")
	infile:close()

	if not instr then
		return 0
	end

	local outfile, err = io.open(target, "wb")
	if not outfile then
		error("File " .. target .. " could not be opened for writing! " .. err or "")
	end
	outfile:write(instr)
	outfile:close()

	return #instr
end

function mtwebview.export_json(fname, data, pretty)
	local f = io.open(fname, "w")
	local json, err = minetest.write_json(data, pretty)
	if err or not f then
		error("error while opening " .. fname .. " " .. (err or ""))
	end
	f:write(json)
	io.close(f)
	return #json
end
