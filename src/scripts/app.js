import regeneratorRuntime from "regenerator-runtime";
//import styles from '../styles/app.scss';
import m_app_css from '!!css-loader!sass-loader!../styles/app.scss';
import m_app_jquery from "jquery";

window.m_screenrecorder = window.m_screenrecorder || {}

console.log(window.m_screenrecorder);

if(typeof window.m_screenrecorder.app == 'function') {
    window.m_screenrecorder.app.init();
} else {
    class _m_screenrecorder {
        constructor() {
            window.m_screenrecorder.app = this;

            let _ = this;

            this.$ = m_app_jquery;
            //this.$ = require('jquery');

            this.settings = {};

            this.init();
            //this.initRecorder()
        }

        init() {
            console.log('init');

            if(window.m_screenrecorder.start == 'autostart') {
                this.settingsFormular();
                this.initStyles();            
            }        

        }

        initStyles() {
            let _ = this;
            _.$('head').append(_.$('<style type="text/css">').text(m_app_css.toString()))
        }

        settingsFormular() {        
            let _ = this;

            _.$formular = _.$(require('html-loader!./formular.html'));


            _.$('body').append(_.$formular);

            _.$formular.addClass('modal-open')
            _.$formular.find('.modal,.modal-backdrop').addClass('show')

            _.$formular.find('input,select').on('change', { _ : _ }, _.settingsFieldChange).trigger('change')


            _.$formular.find('input[name="browser_width"],input[name="browser_height"]').on('init', function(e) {
                let $t = _.$(this);

                $t.val(_.$(window)[$t.attr('name').match(/(width|height)$/)[1]]());
            }).trigger('init')

            _.$formular.find('button[value="record"]').on('click', { _ : _ }, this.settingsSubmit);

            _.$(window).on('close.m_screenrecorder', function() {
                _.$formular.on('transitionend', function() {
                    _.$(this).remove();
                }).removeClass('modal-open').find('.modal,.modal-backdrop').removeClass('show')
            })
            
            _.$formular.find('.close').on('click', function() {
                _.$(window).trigger('close.m_screenrecorder')
            })

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
            
            if(
                _.settings.browser_height != _.$(window).height() || 
                _.settings.browser_width != _.$(window).width()
            ) {
                window.resizeTo(_.settings.browser_width, _.settings.browser_height);
            }

            _.$(window)
                .on('finish.m_screenrecorder', function() {
                    _.$('html')
                        .removeClass('m_screenrecorder-nocursor')
                        .removeClass('m_screenrecorder-dot')
                
                    _.$('#m_screenrecorder_settings_form_mouse_dot').remove()
                })
                .trigger('close.m_screenrecorder');

            _.initRecorder()
        }

        settingsFieldChange(e) {
            let _ = e.data._,
                $t = _.$(this);

            _.settings[$t.attr('name')] = $t.val();

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
            _.mediaRecorder = mediaRecorder;

            mediaRecorder.ondataavailable = e => this.chunks.push(e.data);

            mediaRecorder.onstop = e => this.provideDownload(_);
            mediaRecorder.onerror = e => this.finishRecording(_);
            mediaRecorder.onstart = e => this.startRecording(_);

            _.$(window).one('keydown.m_screenrecorder', function(e) {
                if(e.which == 27) {
                    _.mediaRecorder.stop()
                }
            })        
            
            this.doStartRecording(_)
        }

        handleDataAvailable(event) {
            if (event.data.size > 0) {
                m_screenrecorder.chunks.push(event.data);
                console.log(m_screenrecorder.chunks);
                m_screenrecorder.download();
            } else {
                // ...
            }
        }    
        
        startRecording(_) {
            console.log('start recording');
        }
        
        doStartRecording(_) {

            if(_.settings.delay) {
                let $delayContainer = _.$('<div id="m_screenrecorder_delay_container">'),
                    delayInterval = false;                
                
                _.$('body').append($delayContainer)
                let delayIndex = 0;
                delayInterval = setInterval(function() {
                    $delayContainer.text(_.settings.delay - delayIndex)
                    delayIndex++;
                }, 1000)

                setTimeout(function() {
                    
                    console.log('do start recording delays');
                    
                    clearInterval(delayInterval);
                    $delayContainer.remove()
                    _.mediaRecorder.start();
                    
                }, (_.settings.delay * 1000) )                
                
            } else {
                _.mediaRecorder.start();
            }          
            
        }
        
        finishRecording(_) {
            console.log('finishRecording');
            
            _.$(window).off('keydown.m_screenrecorder')       
            _.$(window).trigger('finish.m_screenrecorder')     
        }

        provideDownload(_) {

            _.finishRecording(_);
            
            let blob = new Blob(_.chunks, {
                type: "video/webm"
            });

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

    window.m_screenrecorder.app = new _m_screenrecorder();
}