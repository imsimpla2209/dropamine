import { message } from "antd"
import axios from "axios"
import saveAs from "file-saver"
import { Http } from "next/api/http"
import { SERVER_ENPOINT } from "next/api/server-url"


export type ResponseType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream'

export const exportExcel = async (option?) => {
  const token = Http._getHeader()
  const options = {
    headers: {
      ...token,
      'Content-Type': "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ,
    },
    params: option?.dates,
    responseType: 'arraybuffer' as ResponseType,
  }
  let fileName = 'AllDataExcel.xlsx'
  let endPoint = `${SERVER_ENPOINT}/api/v1/data/ideasExcel`
  if(option && option.cate) {
    endPoint = `${SERVER_ENPOINT}/api/v1/data/ideasExcel?cateId=${option?.cate}`
    fileName = 'DemandExcel.xlsx'
  }
  await axios
    .get(`${endPoint}`, options)
    .then(res => {
      if(res.status === 200) {
        message.success('The excel are handled and downloaded!!')
        return new Blob([res.data], { type: 'xlsx' })
      }
      else {
        return Promise.reject(message.info('No data match your demand!!!'));
      }
    })
    .then(blob => {

      saveAs(blob, `${fileName}`)
    })
    // .catch(err => message.error(err.message))
}