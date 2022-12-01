

function createMonaco(container, instanceCallback){
    require(['vs/editor/editor.main'], function () {
        // 定义编辑器主题
        monaco.editor.defineTheme('myTheme', {
            base: 'vs',
            inherit: true,
            rules: [{ background: 'EDF9FA' }],
        });
        monaco.editor.setTheme('myTheme');
    
        // 新建一个编辑器
        // let model = monaco.editor.createModel(text, language);
        let editor = monaco.editor.create(container);

        if(instanceCallback){
            instanceCallback(editor);
        }
    });
}