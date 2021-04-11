/**
 * UI
 */

const WIN = require('ui/window');
const LANG = require('../language/');

class UI {
  constructor() {
    // 创建一个窗口
    this.win = new WIN({
      title: `${LANG['title']}`,
      width: 660,
      height: 550,
    });
    this.createMainLayout();
    // this.win.centerOnScreen();
    return {
      onImport: (func) => {
        this.bindToolbarClickHandler(func);
      },
      onAbout: () => {}
    }
  }

  /**
   * 
   * 创建界面
   */
  createMainLayout() {
    // 创建toolbar
    this.createToolbar();
    this.createEditor();
  }

  /**
   * 工具栏
   */
  createToolbar() {
    let toolbar = this.win.win.attachToolbar();
    toolbar.loadStruct([
      { id: 'import', type: 'button', text: LANG['toolbar']['import'], icon: 'sign-in' },
      { id: 'clear', type: 'button', text: LANG['toolbar']['clear'], icon: 'remove' }
    ]);
    this.toolbar = toolbar;
  }

  createEditor(){
    this.editor = null;
    // 初始化编辑器
    this.editor = ace.edit(this.win.win.cell.lastChild);
    this.editor.$blockScrolling = Infinity;
    this.editor.setTheme('ace/theme/tomorrow');
    this.editor.session.setMode(`ace/mode/json`);
    this.editor.session.setUseWrapMode(true);
    this.editor.session.setWrapLimitRange(null, null);

    this.editor.setOptions({
      fontSize: '14px',
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true
    });
    // 编辑器快捷键
    this.editor.commands.addCommand({
      name: 'import',
      bindKey: {
        win: 'Ctrl-S',
        mac: 'Command-S'
      },
      exec: () => {
        this.toolbar.callEvent('onClick', ['import']);
      }
    });
    // this.editor.session.setValue();
    const inter = setInterval(this.editor.resize.bind(this.editor), 200);
      this.win.win.attachEvent('onClose', () => {
        clearInterval(inter);
        return true;
    });

  }
  
  /**
   * 监听按钮点击事件
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  bindToolbarClickHandler(callback) {
    this.toolbar.attachEvent('onClick', (id) => {
      switch (id) {
        case 'import':
          // 保存代码
          this.win.win.progressOn();
          callback({
            "content": this.editor.session.getValue() || ""
          })
          .then((res) => {
            let ret = res['status'];
            if (ret == 1) {
              toastr.success(LANG['success'], antSword['language']['toastr']['success']); 
            }else{
              toastr.error(LANG['error'], antSword['language']['toastr']['error']);
            }
            this.win.win.progressOff();
            // 手动重启应用
            layer.confirm(LANG['confirm']['content'], {
              icon: 2, shift: 6,
              title: LANG['confirm']['title']
            }, (_) => {
              // location.reload();
              antSword.remote.app.exit();
            }, (_) => {
              this.win.win.close();
            });
          }).catch((err) => {
            toastr.error(LANG['error'], antSword['language']['toastr']['error']);
            this.win.win.progressOff();
          });
          break;
        case 'clear':
          this.editor.session.setValue("");
          break;
        default:

      }
    })
  }
}

module.exports = UI;
