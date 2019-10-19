# Stellaris Data Visualization

Paradox's excellent game Stellaris data file viaualization project.

## DDS to PNG

Stellaris use non-compressed `.dds` file to save image. I forked python package `pilgrim` and add 
functions to facilitate processing.

https://github.com/yiyuezhuo/pilgrim

then call `dds_to_png.py` as:

```python
dds_to_png_map(input_path, output_path)
```

## Technology Dependency Force Graph

Created by `d3.js`.

<img src="preview/2.png">

### Update by yourself!

I may not always follow the update of Stellaris. If you enjoy the work and want to keep up-to-date to newest,
you can do it by following steps:

0. You should install Python 3.x and Node.js (Well, Node is strange in this case since python is enough to do all stuffs compare to
the confusing mixing. The reason is when I start to write the project, I try to practice Node skill at the same time. So a ugly separation may be done.).

1. Install python package `pilgrim`, sadly although I have pushed the update to pip maintainer and he merged it. But the 
pip version seems old and don't work in python3. You should install the newest version 
from GitHub(https://github.com/yiyuezhuo/pilgrim).

2. Run `python dds_to_png_cli.py root_path root_output_path`.
(You can find help description by running `python dds_to_png_cli --help`.). 
You will get hundreds png files that will be used in the final graph. 

3. Modify `config.json`. The attribution `stellaris-path` is your Stellaris installation root path.
Another attribution `localFile` is localization file that you want to use. English is default value.

4. Running `node jsonp.js` that take `config.json` generate `jsonpData.js` that is a JSONP data file will be used
in final graph.

