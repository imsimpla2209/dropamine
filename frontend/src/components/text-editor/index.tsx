import { Editor } from 'react-draft-wysiwyg'
import styled from 'styled-components'
interface IRichTextEditor {
  editorState: any
  setEditorState: (val: any) => void
  placeholder?: string
  style?: Object
}

function RichTextEditor(props: IRichTextEditor) {
  const { editorState, setEditorState, placeholder, style } = props

  const onChange = async (value: any) => {
    setEditorState(value)
  }

  const toolBarOptions = {
    inline: { inDropdown: true },
    list: { inDropdown: true },
    textAlign: { inDropdown: true },
    link: { inDropdown: true },
    history: { inDropdown: false },
    image: {
      // uploadCallback: uploadImageCallBack,
      alt: { present: true, mandatory: true },
    },
  }

  return (
    <TextEditorWrapper style={style}>
      <Editor
        editorState={editorState}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onEditorStateChange={(value: any) => {
          onChange(value)
        }}
        toolbar={toolBarOptions}
        stripPastedStyles
        ariaLabel="draftEditor"
        placeholder={placeholder || 'Description'}
      />
    </TextEditorWrapper>
  )
}
export default RichTextEditor

const TextEditorWrapper = styled.div`
  & .editorClassName {
    border: 1px #ccc solid;
    background: white;
    padding: 0 10px;
    word-break: break-word;
    font-weight: 400;
    resize: vertical;
    min-height: 150px;
    width: 100%;
    border-radius: 5px;
    overflow: auto;
  }
  & .toolbarClassName {
    background: #dbdbdb8b;
    border: 0.5px solid #ccc;
    border-radius: 5px;
    & span {
      color: #000000 !important;
    }
  }
`
