
# Luanti web view

State: **WIP**

Exports nodedefs, textures and the map to be viewed in a webbrowser

# Supported drawtypes

https://github.com/minetest/minetest/blob/master/doc/lua_api.md#node-drawtypes

* [x] normal
* [x] airlike
* [ ] liquid
* [ ] flowingliquid
* [x] glasslike
* [ ] glasslike_framed
* [ ] glasslike_framed_optional
* [x] allfaces
* [x] allfaces_optional
* [ ] torchlike
* [ ] signlike
* [ ] plantlike
* [ ] firelike
* [ ] fencelike
* [ ] raillike
* [ ] nodebox
* [x] mesh
* [ ] plantlike_rooted

# Supported paramtype2

https://github.com/minetest/minetest/blob/master/doc/lua_api.md#node-paramtypes

* [x] none
* [ ] facedir
* [ ] flowingliquid
* [ ] 4dir
* [ ] color
* [ ] colorfacedir
* [ ] color4dir
* [ ] colorwallmounted
* [ ] wallmounted
* [ ] leveled
* [ ] degrotate
* [ ] meshoptions
* [ ] glasslikeliquidlevel
* [ ] colordegrotate

# Supported nodeboxes

https://github.com/minetest/minetest/blob/master/doc/lua_api.md#node-boxes

* [ ] regular
* [ ] fixed
* [ ] leveled
* [ ] wallmounted
* [ ] connected
* [ ] fixed


## Debug

```lua
print(dump(minetest.get_node(worldedit.pos1.singleplayer)))
```

![](./screenshot.png)