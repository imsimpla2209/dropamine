import { Http } from 'next/api/http'
import { saveAs } from 'file-saver'
import { message } from 'antd'
import axios from 'axios'
import { SERVER_ENPOINT } from '../../../api/server-url'

export const likeHandler = async id => {
  try {
    const result = await Http.put('/api/v1/idea/like', { ideaId: id })
    console.log('like', result)
  } catch (e) {
    console.error(e)
  }
}

export const omitHandler = async id => {
  try {
    const result = await Http.put('/api/v1/idea/omitVote', { ideaId: id })
    console.log('dont like', result)
  } catch (e) {
    console.error(e)
  }
}

export const disLikeHandler = async id => {
  try {
    const result = await Http.put('/api/v1/idea/dislike', { ideaId: id })
    console.log('dislike', result)
  } catch (e) {
    console.error(e)
  }
}
export type ResponseType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream'

export const handleDownloadFiles = async (id: any, name: any, files?: Array<string>) => {
  if(!files || files?.length === 0) {
    return message.warning('No files attachment in this idea or selected ~.~')
  }
  const token = Http._getHeader()
  const options = {
    headers: {
      ...token,
      'Content-Type': 'application/zip; charset=utf-8',
    },
    params: {},
    responseType: 'arraybuffer' as ResponseType,
  }
  const fileName = name ? `${name + '...'}.zip` : 'attachments.zip'
  await axios
    .get(`${SERVER_ENPOINT}/api/v1/idea/downloadFiles?id=${id}`, options)
    .then(res => {
      message.success('The attachments are handled and downloaded!!')
      return new Blob([res.data], { type: 'application/zip' })
    })
    .then(blob => {
      // const href = window.URL.createObjectURL(blob)
      // const link = document.createElement('a')
      // link.href = href
      // link.setAttribute('download', 'attachments.7z')
      // document.body.appendChild(link)
      // link.click()
      // document.body.removeChild(link)
      console.log(blob)
      saveAs(blob, `${fileName}`)
    })
    .catch(err => Promise.reject(() => message.error(err)))
}


export const handleDeleteIdea = async id => {
  try {
    const result = await Http.delete('/api/v1/idea/delete', id)
    console.log('idea deleted', result)
    message.success('Idea deleted')
  } catch (e) {
    message.error(e.message)
  }
}