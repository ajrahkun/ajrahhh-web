const input = document.getElementById('imageInput')
const preview = document.getElementById('previewImage')
const content = document.getElementById('uploadContent')
const upscaleBtn = document.getElementById('upscaleBtn')

const uploadBox = document.getElementById('uploadBox')
const compareWrap = document.getElementById('compareWrap')
const beforeImg = document.getElementById('beforeImg')
const afterImg = document.getElementById('afterImg')

const MAX_FILE_SIZE = 7 * 1024 * 1024

let selectedFile = null
let selectedFileBase64 = null

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

input.addEventListener('change', async () => {
  const file = input.files[0]
  if (!file || !file.type.startsWith('image/')) return

  if (file.size > MAX_FILE_SIZE) {
    alert('Image size exceeds 7 MB limit.')
    input.value = ''
    return
  }

  selectedFile = file
  selectedFileBase64 = await fileToBase64(file)

  document.getElementById('beforeSize').textContent = formatSize(file.size)

  compareWrap.hidden = true
  uploadBox.style.display = 'flex'

  preview.src = selectedFileBase64
  preview.hidden = false
  content.style.display = 'none'

  upscaleBtn.hidden = false
  upscaleBtn.style.display = 'block'
  upscaleBtn.disabled = false
  upscaleBtn.textContent = 'Upscale'
})

upscaleBtn.addEventListener('click', async () => {
  if (!selectedFile || !selectedFileBase64) return

  const dots = ['.', '..', '...', '..']
  let i = 0

  upscaleBtn.disabled = true
  uploadBox.style.pointerEvents = 'none'

  const dotInterval = setInterval(() => {
    upscaleBtn.textContent = 'Upscaling ' + dots[i % dots.length]
    i++
  }, 800)

  try {
    const res = await fetch('https://sumi-ai-backend.vercel.app/api/upscale_v1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: selectedFileBase64
        })
      }
    )

    const json = await res.json()
    if (!json.result) throw new Error()

    clearInterval(dotInterval)

    beforeImg.src = selectedFileBase64
    afterImg.src = json.result

    const blobRes = await fetch(json.result)
    const blob = await blobRes.blob()

    document.getElementById('afterSize').textContent =
    formatSize(blob.size)

    uploadBox.style.display = 'none'
    compareWrap.hidden = false
    upscaleBtn.style.display = 'none'
  } catch (e) {
    clearInterval(dotInterval)
    upscaleBtn.textContent = 'Failed'
    upscaleBtn.disabled = false
    uploadBox.style.pointerEvents = 'auto'
  }
})

const changeBtn = document.getElementById('changeImageBtn')

if (changeBtn) {
  changeBtn.addEventListener('click', () => {
    uploadBox.style.pointerEvents = 'auto'
    input.value = ''
    input.click()
  })
}

const downloadBtn = document.getElementById('downloadBtn')

if (downloadBtn) {
  downloadBtn.addEventListener('click', async () => {
    if (!afterImg.src) return

    const res = await fetch(afterImg.src)
    const blob = await res.blob()

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'upscale_' + Date.now() + '.jpg'

    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  })
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}
