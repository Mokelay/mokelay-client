const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        main: './run/src/main',
        pc: './run/src/platform/pc',
        h5: './run/src/platform/h5'
    },
    output: {
        path: path.join(__dirname, './run_dist')
    },
    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {

                        less: ExtractTextPlugin.extract({
                            use: ['css-loader?minimize', 'autoprefixer-loader', 'less-loader'],
                            fallback: 'vue-style-loader'
                        }),

                        sass: ExtractTextPlugin.extract({
                            use: ['css-loader?minimize', 'autoprefixer-loader', 'sass-loader'],
                            fallback: 'vue-style-loader'
                        }),

                        css: ExtractTextPlugin.extract({
                            use: ['css-loader', 'autoprefixer-loader'],
                            fallback: 'vue-style-loader'
                        })
                    }
                }
            }, {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                },
                exclude: /node_modules/
            }, {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader?minimize', 'autoprefixer-loader'],
                    fallback: 'style-loader'
                })
            },

            {
                test: /\.less/,
                use: ExtractTextPlugin.extract({
                    use: ['autoprefixer-loader', 'less-loader'],
                    fallback: 'style-loader'
                })
            },

            {
                test: /\.sass/,
                use: ExtractTextPlugin.extract({
                    use: ['autoprefixer-loader', 'sass-loader'],
                    fallback: 'style-loader'
                })
            },

            {
                test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
                loader: 'url-loader?limit=1024'
            }, {
                test: /\.(html|tpl)$/,
                loader: 'html-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
            'vue': 'vue/dist/vue.esm.js',
            jQuery: 'jquery', //解决art-dialog打包报错的问题
            jquery: 'jquery',

            'bb-autocomplete': './buildingblock/elementui/bb-autocomplete.vue', //elementUI 组件
            'bb-badge': './buildingblock/elementui/bb-badge.vue',
            'bb-breadcrumb': './buildingblock/elementui/bb-breadcrumb.vue',
            'bb-button-group': './buildingblock/elementui/bb-button-group.vue',
            'bb-button': './buildingblock/elementui/bb-button.vue',
            'bb-card': './buildingblock/elementui/bb-card.vue',
            'bb-cascader': './buildingblock/elementui/bb-cascader.vue',
            'bb-checkbox-group': './buildingblock/elementui/bb-checkbox-group.vue',
            'bb-color-picker': './buildingblock/elementui/bb-color-picker.vue',
            'bb-date-picker': './buildingblock/elementui/bb-date-picker.vue',
            'bb-dropdown': './buildingblock/elementui/bb-dropdown.vue',
            'bb-editor-switch': './buildingblock/elementui/bb-editor-switch.vue',
            'bb-ele-login': './buildingblock/elementui/bb-ele-login.vue',
            'bb-hidden': './buildingblock/elementui/bb-hidden.vue',
            'bb-input-number': './buildingblock/elementui/bb-input-number.vue',
            'bb-input': './buildingblock/elementui/bb-input.vue',
            'bb-list-scroll': './buildingblock/elementui/bb-list-scroll.vue',
            'bb-menu': './buildingblock/elementui/bb-menu.vue',
            'bb-pagination': './buildingblock/elementui/bb-pagination.vue',
            'bb-panel': './buildingblock/elementui/bb-panel.vue',
            'bb-radio-group': './buildingblock/elementui/bb-radio-group.vue',
            'bb-select': './buildingblock/elementui/bb-select.vue',
            'bb-slider': './buildingblock/elementui/bb-slider.vue',
            'bb-steps': './buildingblock/elementui/bb-steps.vue',
            'bb-tabs': './buildingblock/elementui/bb-tabs.vue',
            'bb-tag': './buildingblock/elementui/bb-tag.vue',
            'bb-textarea': './buildingblock/elementui/bb-textarea.vue',
            'bb-transfer': './buildingblock/elementui/bb-transfer.vue',
            'bb-tree-select': './buildingblock/elementui/bb-tree-select.vue',
            'bb-tree': './buildingblock/elementui/bb-tree.vue',
            'bb-upload': './buildingblock/elementui/bb-upload.vue',
            'bb-array': './buildingblock/elementui/bb-array.vue',
            'bb-button-array': './buildingblock/elementui/bb-button-array.vue',
            'bb-button-form': './buildingblock/elementui/bb-button-form.vue',
            'bb-button-transfer': './buildingblock/elementui/bb-button-transfer.vue',
            'bb-collapse': './buildingblock/elementui/bb-collapse.vue',
            'bb-editor-array': './buildingblock/elementui/bb-editor-array.vue',
            'bb-editor-object': './buildingblock/elementui/bb-editor-object.vue',
            'bb-pop-select': './buildingblock/elementui/bb-pop-select.vue',
            'bb-bar': './buildingblock/elementui/bb-bar.vue',
            'bb-dialog': './buildingblock/elementui/bb-dialog.vue',
            'bb-form': './buildingblock/elementui/bb-form.vue',
            'bb-form-item': './buildingblock/elementui/bb-form-item.vue',
            'bb-list': './buildingblock/elementui/bb-list.vue',
            'bb-view-group': './buildingblock/elementui/bb-view-group.vue',
            'bb-view': './buildingblock/elementui/bb-view.vue',
            'bb-media': './buildingblock/elementui/bb-media.vue',
            'bb-button-media': './buildingblock/elementui/bb-button-media.vue',
            'bb-carousel': './buildingblock/elementui/bb-carousel.vue',
            'bb-input-unit': './buildingblock/elementui/bb-input-unit.vue',

            "bb-billboard": "./buildingblock/independent/bb-billboard.vue", //independent 组件
            "bb-comment-chain": "./buildingblock/independent/bb-comment-chain.vue",
            "bb-count": "./buildingblock/independent/bb-count.vue",
            "bb-countdown": "./buildingblock/independent/bb-countdown.vue",
            "bb-html": "./buildingblock/independent/bb-html.vue",
            "bb-hyperlink": "./buildingblock/independent/bb-hyperlink.vue",
            "bb-img": "./buildingblock/independent/bb-img.vue",
            "bb-photo-single": "./buildingblock/independent/bb-photo-single.vue",
            "bb-photos": "./buildingblock/independent/bb-photos.vue",
            "bb-score": "./buildingblock/independent/bb-score.vue",
            "bb-space": "./buildingblock/independent/bb-space.vue",
            "bb-text": "./buildingblock/independent/bb-text.vue",
            "bb-uuid": "./buildingblock/independent/bb-uuid.vue",
            "bb-video": "./buildingblock/independent/bb-video.vue",
            "bb-vote": "./buildingblock/independent/bb-vote.vue",
            "bb-words": "./buildingblock/independent/bb-words.vue",
            "bb-ellipse-tag": "./buildingblock/independent/bb-ellipse-tag.vue",
            "bb-preview": "./buildingblock/independent/bb-preview.vue",
            "bb-read-bb": "./buildingblock/independent/bb-read-bb.vue",
            "bb-indep-dialog": "./buildingblock/independent/bb-indep-dialog.vue",
            "bb-indep-button": "./buildingblock/independent/bb-indep-button.vue",
            "bb-portal-item-list": "./buildingblock/independent/bb-portal-item-list.vue",
            "bb-indep-ul": "./buildingblock/independent/bb-indep-ul.vue",
            "bb-indep-portal": "./buildingblock/independent/bb-indep-portal.vue",
            "bb-indep-tabs": "./buildingblock/independent/bb-indep-tabs.vue",
            "bb-indep-textarea": "./buildingblock/independent/bb-indep-textarea.vue",
            "bb-lx-item": "./buildingblock/independent/bb-lx-item.vue",
            "bb-lx-item-list": "./buildingblock/independent/bb-lx-item-list.vue",
            "bb-indep-tag": "./buildingblock/independent/bb-indep-tag.vue",
            "bb-indep-sku": "./buildingblock/independent/bb-indep-sku.vue",
            "bb-indep-contact-list": "./buildingblock/independent/bb-indep-contact-list.vue",
            "bb-indep-blog-post": "./buildingblock/independent/bb-indep-blog-post.vue",
            "bb-indep-blog": "./buildingblock/independent/bb-indep-blog.vue",
            "bb-indep-form": "./buildingblock/independent/bb-indep-form.vue",
            "bb-indep-blog-action": "./buildingblock/independent/bb-indep-blog-action.vue",
            "bb-indep-blog-praise": "./buildingblock/independent/bb-indep-blog-praise.vue",
            "bb-indep-blog-comment": "./buildingblock/independent/bb-indep-blog-comment.vue",
            "bb-indep-uploader-audio": "./buildingblock/independent/bb-indep-uploader-audio.vue",
            "bb-indep-audio-player": "./buildingblock/independent/bb-indep-audio-player.vue",
            "bb-indep-blog-List": "./buildingblock/independent/bb-indep-blog-List.vue",
            "bb-indep-share": "./buildingblock/independent/bb-indep-share.vue",
            "bb-indep-report-chain": "./buildingblock/independent/bb-indep-report-chain.vue",
            "bb-indep-resize-box": "./buildingblock/independent/bb-indep-resize-box.vue",
            "bb-indep-svg": "./buildingblock/independent/bb-indep-svg.vue",
            "bb-indep-bpm": "./buildingblock/independent/bb-indep-bpm.vue",
            "bb-indep-pay": "./buildingblock/independent/bb-indep-pay.vue",
            "bb-indep-QR": "./buildingblock/independent/bb-indep-QR.vue",
            "bb-indep-sms": "./buildingblock/independent/bb-indep-sms.vue",
            "bb-indep-list": "./buildingblock/independent/bb-indep-list.vue",
            "bb-div": "./buildingblock/independent/bb-div.vue",

            "bb-vant-address-edit": "./buildingblock/vant/bb-vant-address-edit.vue", //vant 组件
            "bb-vant-button": "./buildingblock/vant/bb-vant-button.vue",
            "bb-vant-slider": "./buildingblock/vant/bb-vant-slider.vue",
            "bb-vant-radio-group": "./buildingblock/vant/bb-vant-radio-group.vue",
            "bb-vant-switch": "./buildingblock/vant/bb-vant-switch.vue",
            "bb-vant-cell": "./buildingblock/vant/bb-vant-cell.vue",
            "bb-vant-cell-group": "./buildingblock/vant/bb-vant-cell-group.vue",
            "bb-vant-checkbox": "./buildingblock/vant/bb-vant-checkbox.vue",
            "bb-vant-number-keyboard": "./buildingblock/vant/bb-vant-number-keyboard.vue",
            "bb-vant-field": "./buildingblock/vant/bb-vant-field.vue",
            "bb-vant-field-number": "./buildingblock/vant/bb-vant-field-number.vue",
            "bb-vant-swipe": "./buildingblock/vant/bb-vant-swipe.vue",
            "bb-vant-tag": "./buildingblock/vant/bb-vant-tag.vue",
            "bb-vant-password-input": "./buildingblock/vant/bb-vant-password-input.vue",
            "bb-vant-tab-bar": "./buildingblock/vant/bb-vant-tab-bar.vue",
            "bb-vant-dialog": "./buildingblock/vant/bb-vant-dialog.vue",
            "bb-vant-switch-cell": "./buildingblock/vant/bb-vant-switch-cell.vue",
            "bb-vant-search": "./buildingblock/vant/bb-vant-search.vue",
            "bb-vant-stepper": "./buildingblock/vant/bb-vant-stepper.vue",
            "bb-vant-circle": "./buildingblock/vant/bb-vant-circle.vue",

            "bb-echarts": "./buildingblock/vendor/bb-echarts.vue", //vendor组件
            "bb-editor-md": "./buildingblock/vendor/bb-editor-md.vue",
            "bb-editor-weditor": "./buildingblock/vendor/bb-editor-weditor.vue",
            "bb-json": "./buildingblock/vendor/bb-json.vue",
            "bb-relation-chart": "./buildingblock/vendor/bb-relation-chart.vue",
            "bb-calendar": "./buildingblock/vendor/bb-calendar/bb-calendar.vue",
            "bb-pdf": "./buildingblock/vendor/bb-pdf/bb-pdf.vue",

            "bb-editor-code": "./buildingblock/bb-editor-code.vue", //根目录组件
            "bb-picture-preview": "./buildingblock/bb-picture-preview.vue",
            "bb-product-item": "./buildingblock/bb-product-item.vue",

            "bb-layout-canvas-edit": "./layout/bb-layout-canvas-edit.vue", //布局类组件
            "bb-layout-canvas": "./layout/bb-layout-canvas.vue",
            "bb-layout-container": "./layout/bb-layout-container.vue",
            "bb-layout-grid": "./layout/bb-layout-grid.vue",
            "bb-layout-seriation-edit": "./layout/bb-layout-seriation-edit.vue",
            "bb-layout-seriation": "./layout/bb-layout-seriation.vue",
            "bb-page-edit": "./layout/bb-page-edit.vue",
            "bb-page": "./layout/bb-page.vue",
            "bb-seriation-item-edit": "./layout/bb-seriation-item-edit.vue",

            "bb-api-info": "./module/bb-api-info.vue", //module类组件
            "bb-apilego-config": "./module/bb-apilego-config.vue",
            "bb-bb-select": "./module/bb-bb-select.vue",
            "bb-bblist-select": "./module/bb-bblist-select.vue",
            "bb-bbtype-select": "./module/bb-bbtype-select.vue",
            "bb-button-select": "./module/bb-button-select.vue",
            "bb-columns-select": "./module/bb-columns-select.vue",
            "bb-config-array": "./module/bb-config-array.vue",
            "bb-config": "./module/bb-config.vue",
            "bb-ds-select": "./module/bb-ds-select.vue",
            "bb-echarts-select": "./module/bb-echarts-select.vue",
            "bb-field-select": "./module/bb-field-select.vue",
            "bb-field-tree-pop-select": "./module/bb-field-tree-pop-select.vue",
            "bb-field-tree-select": "./module/bb-field-tree-select.vue",
            "bb-icon-select": "./module/bb-icon-select.vue",
            "bb-icon": "./module/bb-icon.vue",
            "bb-css-editor": "./module/bb-css-editor.vue",
            "bb-button-css-editor": "./module/bb-button-css-editor.vue",
            "bb-sms-verification": "./module/bb-sms-verification.vue",
            "bb-module": "./module/bb-module.vue",
            "bb-button-attribute-config": "./module/bb-button-attribute-config.vue",
            "bb-ds-column-select": "./module/bb-ds-column-select.vue",
            "bb-buzz-select": "./module/bb-buzz-select.vue"
        }
    }
};