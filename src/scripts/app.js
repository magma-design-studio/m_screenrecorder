import regeneratorRuntime from "regenerator-runtime";

class _m_screenrecorder {
    constructor() {
        this.$ = require('jquery');
        
        console.info('m_screenrecorder');
        if(location.hash == '#test') {
            this.printTestScreen()
        }
        
        this.settings = {};
        
        this.settingsFormular();
        //this.initRecorder()
    }
    
    settingsFormular() {        
        let _ = this;
        
        //_.css = require('css-loader!postcss-loader!sass-loader!./styles/app.scss');
        _.$formular = _.$(require('html-loader!./formular.html'));
        
        
        _.$('body').append(_.$formular);
        
        _.$formular.find('.modal').addClass('show').css({ display : 'block' })
        console.log(_.$formular);
        
        _.$formular.find('input,select').on('change', { _ : _ }, _.settingsFieldChange).trigger('change')
        
        
        _.$formular.find('input[name="browser_width"],input[name="browser_height"]').on('init', function(e) {
            let $t = _.$(this);
            
            $t.val(_.$(window)[$t.attr('name').match(/(width|height)$/)[1]]());
        }).trigger('init')
        
        _.$formular.find('button[value="record"]').on('click', { _ : _ }, this.settingsSubmit);
        
        
        
    }
    
    dotSettings(e) {
        let _ = this,
            $c = _.$('#m_screenrecorder_settings_form_mouse_dot_container'),
            $preview = _.$('#m_screenrecorder_settings_form_mouse_dot_preview'),
            rootStyle = document.documentElement.style;
            
        rootStyle.setProperty('--m_screenrecorder-mouse-dot-size', _.settings.mouse_dot_size + "px");
        rootStyle.setProperty('--m_screenrecorder-mouse-dot-color', _.settings.mouse_dot_color);
        rootStyle.setProperty('--m_screenrecorder-mouse-dot-opacity', _.settings.mouse_dot_opacity);        
        
        if(_.settings.mouse == 'dot') {
            $c.addClass('show')
        } else {
            $c.removeClass('show')
        }
    }
    
    settingsSubmit(e) {
        let _ = e.data._
        e.preventDefault()
        
        switch(_.settings.mouse) {
            case 'none':
                _.$('html').addClass('m_screenrecorder-nocursor')
                break;
            case 'dot':
                _.$('html').addClass('m_screenrecorder-dot');
                
                let rootStyle = document.documentElement.style;
                
                _.$('body').append('<div id="m_screenrecorder_settings_form_mouse_dot">');
                
                _.$(window).on('mousemove.m_screenrecorder', function(e) {
                    rootStyle.setProperty('--m_screenrecorder-mouse-x-pos', e.clientX + "px");       
                    rootStyle.setProperty('--m_screenrecorder-mouse-y-pos', e.clientY + "px");       
                }).trigger('mousemove.m_screenrecorder')
                
                break;
            default:
            case 'mouse':
                break;
        }
                        
        
        _.$formular.animate({ opacity : 0 }, function() { _.$(this).remove() })
        
        let $delayContainer = _.$('<div id="m_screenrecorder_delay_container">'),
            delayInterval = false;
        
        if(_.settings.delay) {
            _.$('body').append($delayContainer)
            let delayIndex = 0;
            delayInterval = setInterval(function() {
                $delayContainer.text(_.settings.delay - delayIndex)
                delayIndex++;
            }, 1000)
        }
        
        setTimeout(function() {
            clearInterval(delayInterval);
            $delayContainer.remove()
            _.initRecorder()
        }, (_.settings.delay * 1000) )
        
    }
    
    settingsFieldChange(e) {
        let _ = e.data._,
            $t = _.$(this);
        
        _.settings[$t.attr('name')] = $t.val();
        console.log(_.settings);
        
        _.dotSettings()
    }
    
    printTestScreen() {
        let $b = this.$('body').append('<h1>Hello World</h1>')
        
        for(let i=0; i<150; i++) {
            $b.append('<div>'+(i+1)+'. Line<br /></div>')
        }
    }
    
    async initRecorder(e) {
        let _ = this;
        
        let stream = await navigator.mediaDevices.getDisplayMedia({
            video: { mediaSource: "screen" }
        });        
        
        
        // Optional frames per second argument.
        this.chunks = [];

        let options = {  };
        
        switch(_.settings.file_format) {
            /*case 'mp4':
                options.mimeType = 'video/mp4';
                break;*/
            default:
                options.mimeType = 'video/webm; codecs=vp9';
                break;
                
        }
        
        let mediaRecorder = new MediaRecorder(stream, options);

        mediaRecorder.ondataavailable = e => this.chunks.push(e.data);
        mediaRecorder.start();     
        
        mediaRecorder.onstop = e => this.provideDownload(_);
        
        
        _.$(window).one('keydown.m_screenrecorder', function(e) {
            if(e.which == 27) {
                console.log('do stop')
                mediaRecorder.stop()
            }
        })          
    }
    
    
    
    
    handleDataAvailable(event) {
        console.log("data-available");
        if (event.data.size > 0) {
            m_screenrecorder.chunks.push(event.data);
            console.log(m_screenrecorder.chunks);
            m_screenrecorder.download();
        } else {
            // ...
        }
    }    
    
    provideDownload(_) {
        _.$(window).off('keydown.m_screenrecorder')         
        
        let blob = new Blob(m_screenrecorder.chunks, {
            type: "video/webm"
        });
        
        console.log(blob);
        
        let url = URL.createObjectURL(blob);
        let a = document.createElement("a");
        
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = url;
        a.download = "test.webm";
        a.click();
        window.URL.revokeObjectURL(url);
        
    }


    
    
    
}

const m_screenrecorder = new _m_screenrecorder();