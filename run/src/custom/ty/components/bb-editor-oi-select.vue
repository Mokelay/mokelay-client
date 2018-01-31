<template>
    <el-cascader
            :options="dss"
            @active-item-change="handleItemChange"
            :props="props"
            @change="valChange"
    ></el-cascader>
</template>

<script>

    export default {
        name: 'bb-editor-oi-select',
        components: {},
        computed: {},
        created: function () {
            this.getData();
        },
        props:{
            apiLegoId:{
                required: true
            },
            legoAlias:{
                required: true
            }
        },
        data() {
            return {
                dss: [{
                    label: 'ds',
                    value: 'ds',
                    ois: []
                }],
                props: {
                    children: 'ois'
                }
            };
        },
        methods: {
            getData(){
                let t = this;
                _TY_Tool.get(_TY_ContentPath+"/read-lego-info",{
                    legoAlias:t.legoAlias
                }).then(function (response) {
                    let data = response['data'];
                    if (data['ok']) {
                        let info = data['data']['data'];
                        if(info&&info.supportDST){
                            let dsts = JSON.parse(info.supportDST);
                            let param ='';
                            for(let i in dsts){
                                if(i>0){
                                    param=param+",";
                                }
                                param=param+dsts[i];
                            }
                            var dsUrl = _TY_ContentPath+"/list-ds-by-dst";
                            if(t.$route.path.indexOf("-self")>=0){
                                dsUrl = _TY_ContentPath+"/list-ds-by-dst-self";
                            }
                            _TY_Tool.get(dsUrl,{
                                dst:param
                            }).then(function (response) {
                                let data = response['data'];
                                if (data['ok']) {
                                    let list = data['data']['data_list']['list'];
                                    t.dss = [];
                                    for (let i in list) {
                                        t.dss.push({
                                            label: list[i].name,
                                            value: list[i].alias,
                                            ois: []
                                        });
                                    }
                                }
                            }).catch(function (error) {
                            });
                        }

                    }
                }).catch(function (error) {
                });


            },
            handleItemChange(val){
                let t = this;
                _TY_Tool.get(_TY_ContentPath+"/list-oi-by-ds", {
                    dsAlias: val[0]
                }).then(function (response) {
                    let data = response['data'];
                    if (data['ok']) {
                        let list = data['data']['data_list']['list'];

                        for (let i = 0; i < t.dss.length; i++) {
                            let ds = t.dss[i];
                            if (ds.value == val) {
                                ds.ois = [];
                                for (let i in list) {
                                    ds.ois.push({
                                        label: list[i].name,
                                        value: list[i].alias,
                                    });
                                }
                                break;
                            }
                        }
                    }
                }).catch(function (error) {
                });
            },
            valChange(val){
                let t = this;
                this.$store.dispatch('updateApiLego', {
                    apiLegoId: t.apiLegoId,
                    oiAlias: val[1]
                });
            }
        }
    }
</script>

<style scoped>
</style>