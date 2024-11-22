"ui"
auto()

if (!floaty.checkPermission()) {
    toast("本脚本需要悬浮窗权限来显示悬浮窗，请在随后的界面中允许并重新运行本脚本。");
    floaty.requestPermission();
    exit();
}

const PackageName = "com.tencent.weread"
const ErrorMsg = "脚本已经开始运行...\n请打开微信读书，并打开一本书籍的阅读界面"
const SuccessMsg = "正在自动翻页, 音量上键关闭脚本"

// start new thread run swipe gesture
let swipeNextPage = (msgWin, interval) => {
    threads.start(() => {
        while (true) {
            if (currentPackage() === PackageName) {
                ui.run(() => {
                    msgWin.msg.setText(SuccessMsg)
                })
                swipe(500, 500, random(200, 500), 500, random(100, 500))
            } else {
                ui.run(() => {
                    msgWin.msg.setText(ErrorMsg)
                })
            }

            sleep(random() * interval)
        }
    })
}

let initFloatyWindow = () => {
    let w = floaty.window(
        <card>
            <text id="msg" />
        </card>
    )

    ui.run(() => {
        w.msg.setText(ErrorMsg)
        w.msg.click(() => {
            if (currentPackage() === PackageName) {
                w.msg.setText(SuccessMsg)
                // start swipe next page thread
                swipeNextPage(w, 1000 * 20)
            }
        })
    })
    return w
}

initFloatyWindow()

events.observeKey();

events.on("key_down", (keyCode) => {
    if (keyCode == keys.volume_up) {
        exit()
    }
})

// keep floaty window alive
setInterval(() => { }, 1000)
