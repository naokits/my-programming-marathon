
    /// デバッガを使用中かどうかを返す
    /// [ios - Detect if Swift app is being run from Xcode - Stack Overflow](http://stackoverflow.com/questions/33177182/detect-if-swift-app-is-being-run-from-xcode/33177600#33177600)
    func amIBeingDebugged() -> Bool {

        var info = kinfo_proc()
        var mib : [Int32] = [CTL_KERN, KERN_PROC, KERN_PROC_PID, getpid()]
        var size = strideofValue(info)
        let junk = sysctl(&mib, UInt32(mib.count), &info, &size, nil, 0)
        assert(junk == 0, "sysctl failed")
        return (info.kp_proc.p_flag & P_TRACED) != 0
    }

    /// 利用する側
    func hoge() {
        if amIBeingDebugged() {
            print("デバッグ中")
        } else {
            print("デバッグ中ではない")
        }
    }
