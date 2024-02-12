import { ChangeEvent, FormEvent, useState } from 'react'
import logo from './assets/nlw-expert-logo.svg'
import { NoteCard } from './components/note-card'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { toast } from 'sonner'

interface Note{
  id: string;
  date: Date;
  content: string;
}

export function App() {
  const [search, setSearch] = useState('');
  const [showOnBoarding, setShowOnBoarding] = useState(true);
  const [content, setContent] = useState('');
  const [notes, setNotes] = useState<Note[]>(
    () => {
      const notesOnStorage = localStorage.getItem('notes');
      if(notesOnStorage){
        return JSON.parse(notesOnStorage);
      }
      return []
    }
  )
  function handleStartEditor(){
    setShowOnBoarding(false);
  }
  function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>){
    setContent(event.target.value);
    if(event.target.value === ''){
      setShowOnBoarding(true);
    }
  }
  function onNoteCreated(content: string){
    const newNote = {id: crypto.randomUUID(), date: new Date(), content}
    const notesArray = [newNote, ...notes]
    setNotes(notesArray);
    localStorage.setItem('notes', JSON.stringify(notesArray))
  }
  function handleSaveNote(event: FormEvent){
    event.preventDefault();
    onNoteCreated(content);
    setContent('');
    setShowOnBoarding(true);
    toast.success('Nota criada com sucesso!');
  }
  function handleSearch(event:ChangeEvent<HTMLInputElement>){
    const query = event.target.value;
    setSearch(query);
  }
  const filteredNotes = search != '' 
    ? notes.filter(note => note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
    : notes

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6">
      <img src={logo} alt="NLW Expert"></img>
      <form className="w-full">
        <input type="text" placeholder='Busque em suas notas...' onChange={handleSearch} className='w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500'/>
      </form>
      <div className='h-px bg-slate-700'></div>
      <div className="grid grid-cols-3 gap-6 auto-rows-[250px]">
        <Dialog.Root>
          <Dialog.Trigger className='rounded-md flex flex-col bg-slate-700 text-left p-5 gap-3 outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400'>
            <span className="text-sm font-medium text-slate-200">Adicionar nota</span>
            <p className='text-sm leading-6 text-slate-400'>Grave uma nota em áudio que será convertida para texto automaticamente.</p>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className='inset-0 fixed bg-black/60'></Dialog.Overlay>
            <Dialog.Content className='fixed overflow-hidden left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[640px] w-full h-[60vh] bg-slate-700 rounded-md flex flex-col outline-none'>
              <Dialog.Close className='absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100'>
                <X className='size-5'></X>
              </Dialog.Close>
              <form onSubmit={handleSaveNote} className='flex-1 flex flex-col'>
                <div className='flex flex-1 flex-col gap-3 p-5'>
                  <span className="text-sm font-medium text-slate-300">Adicionar nota</span>
                  {showOnBoarding ? (<p className='text-sm leading-6 text-slate-400'>Comece <button className='font-medium text-lime-400 hover:underline'>gravando uma nota</button> em áudio ou se preferir <button onClick={handleStartEditor} className='font-medium text-lime-400 hover:underline'>utilize apenas texto</button></p>) : (<textarea autoFocus className='text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none' onChange={handleContentChanged} value={content}></textarea>)}
                </div>
                <button type='submit' className='w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500'><span>Salvar nota</span></button>
              </form>
            </Dialog.Content>
          </Dialog.Portal>
          {filteredNotes.map(note => {return <NoteCard key={note.id} note={note}></NoteCard>})}
        </Dialog.Root>
      </div>
    </div>
  )
}

