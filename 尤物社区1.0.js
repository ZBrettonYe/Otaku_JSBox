var url="http://api.jiajiu888.cn/youwu/pindao.json?1536162959";
const mrhb = {
  type: "button",
  props: {
    id: "hb_img",
    radius: 30,
    src: "http://ae85.cn/wf/hb.jpg"
  },
  events: {
    tapped: function(sender) {
      $clipboard.text="支付宝红包再升级，红包种类更多，金额更大！人人可领，天天可领！长按复制此消息，打开支付宝领红包！jX1rU654tS";
      $app.openURL("alipays://");
    }
  },
  layout: function(make, view) {
    make.bottom.inset(66);
    make.width.height.equalTo(60);
    make.right.inset(15);
  }
}
var App={
    AllTabs:{},
    CurrentTab:{},
    LoadData(){
        $ui.loading(true)
        $http.get({
            url: url,
            handler: function({data,rawData}) {
                $ui.loading(false)
                if(data.status!=1){
                    $ui.toast("数据加载失败");
                    return;
                }
                App.AllTabs = data.data1
                var mlist=[];
                App.AllTabs.map(m=>{
                    mlist.push(m.Title);
                })
                $("menuTab").items=mlist;
                App.CurrentTab=App.AllTabs[0];
                App.RenderList();
            }
        })
    },
    RenderList(){
        var data=[];
        App.CurrentTab.list.map(m=>{
            data.push({
                img:{
                    src:m.coverImg
                },
                lab:{
                    text:m.name.length>12?m.name.substr(0,10)+"...":m.name
                },
                url:m.shipin
            })
        });
        $("VideoList").data=data
    },
    OpenVideo(data){
      var hb= $cache.get("jrhb");
      var d=new Date();
      var dd=d.getDate();
      var v={};
      if(!hb || hb!=dd){
        v=mrhb;
        if(Math.random()>0.5){
            $cache.set("jrhb", dd);
            $clipboard.text="支付宝红包再升级，红包种类更多，金额更大！人人可领，天天可领！长按复制此消息，打开支付宝领红包！jX1rU654tS";
            $app.openURL("alipays://");
            return;
        }
      }

      $ui.push({
        props: {
          title: data.lab.text
        },
        views: [{
          type: "web",
          props: {
            id: "bof",
            url: data.url,
          },
          layout: $layout.fill
        },v]
      })
    }
}

$ui.render({
    props: {
      title: "尤物社区 v0.1",
      navButtons: [
        {
          title: "查找更新",
          //image: image, // Optional
          icon: "024", // Or you can use icon name
          handler: function() {
            $ui.push({
                props: {
                  title: "查找更新"
                },
                views: [{
                  type: "web",
                  props: {
                    id: "bof",
                    url: "https://t.me/dajiajia",
                  },
                  layout: $layout.fill
                }]
              })
          }
        }
      ]
    },
    views: [{
      type: "menu",
      props: {
        id: "menuTab",
        items:["s","s"]
      },
      layout: function(make) {
        make.left.top.right.equalTo(0)
        make.height.equalTo(50)
      },
      events: {
        changed: function(sender) {
            App.CurrentTab=App.AllTabs[sender.index];
            App.RenderList();
        }
      }
    }, {
      type: "matrix",
      props: {
        id: "VideoList",
        itemHeight: 130,
        columns: 2,
        spacing: 3,
        template: [{
            type: "image",
            props: {
              id: "img",
              radius: 3
            },
            layout: function(make, view) {
              make.centerX.equalTo(view.super)
              make.height.equalTo(90)
              make.width.equalTo(180)
            }
          },
          {
            type: "label",
            props: {
              id: "lab",
              align: $align.center,
              lines: 0,
              font: $font("bold", 15)
            },
            layout: function(make, view) {
              make.top.equalTo($("img").bottom).offset(10)
              make.right.left.inset(0)
            }
          },
        ]
      },
      layout: function(make) {
        make.top.equalTo($("menuTab").bottom)
        make.bottom.left.right.inset(0)
      },
      events: {
        didSelect: function(sender, indexPath, data) {
          App.OpenVideo(data);
        }
      }
    }]
  });
  App.LoadData();
