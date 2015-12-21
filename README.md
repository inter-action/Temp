# Desc
    js 创建的链表, js created single linked list
    js 创建的HashMapTree
    js 创建数据缓存, js created simple cache
    mocha 异步测试
    webpack 打包忽略特定依赖, webpack bundle with ignoring specific module

# run test
    npm test
    npm run stest

#todos
    done:

    pending:
        run stest will not work
        webpack 输出打包：
            export main.js, should not include 'underscore' dependences

                create a gulp task, wrap webpack generated content in
                    ```
                    (function(){
                        this.underscore = window._;
                        {{webpack content goes here}}
                    }())
                    ```
                    https://nodejs.org/api/stream.html#stream_readable_pipe_destination_options
                    https://github.com/dominictarr/map-stream
                    https://github.com/gulpjs/vinyl-fs

        refine cate_relations@directUpAndDownNodes test.
        fix cate_container test's todos when working



