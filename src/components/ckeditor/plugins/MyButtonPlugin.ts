import { Plugin, ButtonView } from 'ckeditor5'

export default class MyButtonPlugin extends Plugin {

  init() {

    const editor = this.editor

    editor.ui.componentFactory.add('myButton', locale => {

      const button = new ButtonView(locale)

      button.set({
        label: 'Lưu Template',
        withText: true,
        tooltip: true
      })

      button.on('execute', () => {

        editor.fire('myButton:save', {
          htmlContent: editor.getData()
        })

      })

      return button
    })
  }

}