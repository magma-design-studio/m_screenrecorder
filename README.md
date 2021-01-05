# m_screenrecorder

m_screenrecorder is an open source solution to film an interaction with a website or your screen.

## Usage

Please copy the following JavaScript and create a bookmark in your browser and fill the link field with this snippet.

```
javascript:(function(i,s,o,g,r,a,m){ i[r]={ start : 'autostart' };a=s.createElement(o), m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m) })(window,document,'script','https://cdn.jsdelivr.net/npm/m_screenrecorder/dist/m_screenrecorder.js','m_screenrecorder');
```

## Screenshots

![Initial view](/demo/m_screenrecorder_initial.png?raw=true)

![Change your default cursor](/demo/m_screenrecorder_mouse-setting.png?raw=true)

You can change your default cursor to a custom sized and colored dot or just hide it.


## Known issues

The m_screenrecorder works on most websites. A few websites prohibit the integration of external scripts (e.g. GitHub).