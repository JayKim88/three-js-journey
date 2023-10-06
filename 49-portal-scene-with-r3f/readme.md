https://github.com/JayKim88/three-js-journey/assets/55373668/9851e357-abdc-47d5-b881-13654027c6eb

# baked model?

Baking to texture is the process of approximating complex surface effects as simple 2D bitmaps and then assigning them to objects.

By creating a library of 'baked' texture maps, **3D visual effects on objects can be rendered in real time without having to recalculate elements such as materials, lighting, and shadows**.

It can save you time, memory, and render quality by transferring the details of a high-resolution mesh or image onto a low-resolution one.

# toneMapping?

You might have noticed something strange with the colors, especially when we added the material to the pole lights. The color should be much brighter.

The reason is that R3F, by default, sets a **`toneMapping`**.

This **`toneMapping`** is usually welcome and colors look better with it, but, in our case, we don’t want it because our scene has been baked from Blender and Blender already applies tone mapping with its color management system.
