import * as React from 'react';
import { ReactElement } from 'react';
import { Button, DocumentLoadEvent, PdfJs, Position, PrimaryButton, Tooltip, Viewer, ThemeContext, RenderPage, RenderPageProps } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin, ToolbarProps, ToolbarSlot  } from '@react-pdf-viewer/default-layout';
import {
    HighlightArea,
    highlightPlugin,
    MessageIcon,
    RenderHighlightContentProps,
    RenderHighlightTargetProps,
    RenderHighlightsProps,
} from '@react-pdf-viewer/highlight';
import { themePlugin } from '@react-pdf-viewer/theme';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

interface Note {
    id: number;
    content: string;
    highlightAreas: HighlightArea[];
    quote: string;
}

interface HighlightExampleProps {
    fileUrl: string;
}

const HighlightExample: React.FC<HighlightExampleProps> = ({ fileUrl }) => {
    const themePluginInstance = themePlugin();
    const { SwitchThemeButton } = themePluginInstance;
    const [currentTheme, setCurrentTheme] = React.useState('dark');
    const themeContext = { currentTheme, setCurrentTheme };
    const [message, setMessage] = React.useState('');
    const [notes, setNotes] = React.useState<Note[]>([]);
    const notesContainerRef = React.useRef<HTMLDivElement | null>(null);
    let noteId = notes.length;

    const noteEles: Map<number, HTMLElement> = new Map();
    const [currentDoc, setCurrentDoc] = React.useState<PdfJs.PdfDocument | null>(null);

    const handleDocumentLoad = (e: DocumentLoadEvent) => {
        setCurrentDoc(e.doc);
        if (currentDoc && currentDoc !== e.doc) {
            // User opens new document
            setNotes([]);
        }
    };

    const renderToolbar = (Toolbar: (props: ToolbarProps) => ReactElement) => (
        <Toolbar>
            {(slots: ToolbarSlot) => {
                const {
                    CurrentPageInput,
                    EnterFullScreen,
                    GoToNextPage,
                    GoToPreviousPage,
                    NumberOfPages,
                    ShowSearchPopover,
                    Zoom,
                    ZoomIn,
                    ZoomOut,
                    SwitchThemeMenuItem
                } = slots;
                return (
                    <div
                        style={{
                            alignItems: 'center',
                            display: 'flex',
                        }}
                    >
                        <div style={{ padding: '0px 2px' }}>
                            <ShowSearchPopover />
                        </div>
                        <div style={{ padding: '0px 2px' }}>
                            <ZoomOut />
                        </div>
                        <div style={{ padding: '0px 2px' }}>
                            <Zoom />
                        </div>
                        <div style={{ padding: '0px 2px' }}>
                            <ZoomIn />
                        </div>
                        <div style={{ padding: '0px 2px', marginLeft: 'auto' }}>
                            <GoToPreviousPage />
                        </div>
                        <div style={{ padding: '0px 2px', width: '4rem' }}>
                            <CurrentPageInput />
                        </div>
                        <div style={{ padding: '0px 2px' }}>
                            / <NumberOfPages />
                        </div>
                        <div style={{ padding: '0px 2px' }}>
                            <GoToNextPage />
                        </div>
                        <div style={{ padding: '0px 2px', marginLeft: 'auto' }}>
                            {/* <EnterFullScreen /> */}
                            <SwitchThemeButton/>
                        </div>
                    </div>
                );
            }}
        </Toolbar>
    );

    const getMessage = (props:any) => {
        window.open('https://www.google.com/search?q='+props, '_blank');
    }

    const renderHighlightTarget = (props: RenderHighlightTargetProps) => (
        <div>
            <div
                style={{
                    background: '#fff',
                    display: 'flex',
                    position: 'absolute',
                    left: `${props.selectionRegion.left}%`,
                    top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
                    transform: 'translate(0, 8px)',
                }}
            >
                <Tooltip
                    position={Position.BottomCenter}
                    target={
                        <Button onClick={props.toggle}>
                            note
                        </Button>
                    }
                    content={() => <div style={{ width: '100px' }}>Add a note</div>}
                    offset={{ left: 0, top: 6 }}
                />
                <div style={{margin:'4px'}}/>
                <Tooltip
                    position={Position.BottomCenter}
                    target={
                        <Button onClick={()=>{getMessage(props.selectedText)}}>
                            search
                        </Button>
                    }
                    content={() => <div style={{ width: '100px' }}>Search</div>}
                    offset={{ left: 0, top: 6 }}
                    
                />
            </div>
        </div>
    );

    const renderHighlightContent = (props: RenderHighlightContentProps) => {
        const addNote = () => {
            if (message !== '') {
                const note: Note = {
                    id: ++noteId,
                    content: message,
                    highlightAreas: props.highlightAreas,
                    quote: props.selectedText,
                };
                setNotes(notes.concat([note]));
                props.cancel();
            }
        };

        return (
            <div
                style={{
                    background: '#fff',
                    border: '1px solid rgba(0, 0, 0, .3)',
                    borderRadius: '2px',
                    padding: '8px',
                    position: 'absolute',
                    left: `${props.selectionRegion.left}%`,
                    top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
                    zIndex: 1,
                }}
            >
                <div>
                    <textarea
                        rows={3}
                        style={{
                            border: '1px solid rgba(0, 0, 0, .3)',
                        }}
                        onChange={(e) => setMessage(e.target.value)}
                    ></textarea>
                </div>
                <div
                    style={{
                        display: 'flex',
                        marginTop: '8px',
                    }}
                >
                    <div style={{ marginRight: '8px' }}>
                        <PrimaryButton onClick={addNote}>Add</PrimaryButton>
                    </div>
                    <Button onClick={props.cancel}>Cancel</Button>
                </div>
            </div>
        );
    };

    // const jumpToNote = (note: Note) => {
    //     activateTab(3);
    //     const notesContainer = notesContainerRef.current;
    //     // if (noteEles.has(note.id) && notesContainer) {
    //     //     // notesContainer.scrollTop = noteEles.get(note.id).getBoundingClientRect().top;
    //     // }
    // };

    const renderHighlights = (props: RenderHighlightsProps) => (
        <div>
            {notes.map((note) => (
                <React.Fragment key={note.id}>
                    {note.highlightAreas
                        .filter((area) => area.pageIndex === props.pageIndex)
                        .map((area, idx) => (
                            <div
                                key={idx}
                                style={Object.assign(
                                    {},
                                    {
                                        background: 'red',
                                        opacity: 0.4,
                                    },
                                    props.getCssProperties(area, props.rotation)
                                )}
                                // onClick={() => jumpToNote(note)}
                            />
                        ))}
                </React.Fragment>
            ))}
        </div>
    );

    const highlightPluginInstance = highlightPlugin({
        renderHighlightTarget,
        renderHighlightContent,
        renderHighlights,
    });

    const { jumpToHighlightArea } = highlightPluginInstance;

    React.useEffect(() => {
        return () => {
            noteEles.clear();
        };
    }, []);

    const sidebarNotes = (
        <div
            ref={notesContainerRef}
            style={{
                overflow: 'auto',
                width: '100%',
            }}
        >
            {notes.length === 0 && <div style={{ textAlign: 'center' }}>There is no note</div>}
            {notes.map((note) => {
                console.log(note.id, 'testsss')
                return (
                    <div
                        key={note.id}
                        style={{
                            borderBottom: '1px solid rgba(0, 0, 0, .3)',
                            cursor: 'pointer',
                            padding: '8px',
                        }}
                        onClick={() => jumpToHighlightArea(note.highlightAreas[0])}
                        ref={(ref): void => {
                            noteEles.set(note.id, ref as HTMLElement);
                        }}
                    >
                        <blockquote
                            style={{
                                borderLeft: '2px solid rgba(0, 0, 0, 0.2)',
                                fontSize: '.75rem',
                                lineHeight: 1.5,
                                margin: '0 0 8px 0',
                                paddingLeft: '8px',
                                textAlign: 'justify',
                            }}
                        >
                            {note.quote}
                        </blockquote>
                        {note.content}
                        {/* add tombol delete disini */}
                    </div>
                );
            })}
        </div>
    );

    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        sidebarTabs: (defaultTabs) => [
            defaultTabs[0],
            {
                content: sidebarNotes,
                icon: <MessageIcon />,
                title: 'Notes',
            }
        ],
        renderToolbar
    });

    const { activateTab } = defaultLayoutPluginInstance;

    const renderPage: RenderPage = (props: RenderPageProps) => (
        <>
            {props.canvasLayer.children}
            <div
                style={{
                    alignItems: 'center',
                    display: 'flex',
                    height: '100%',
                    justifyContent: 'center',
                    left: 0,
                    position: 'absolute',
                    top: 0,
                    width: '100%',
                }}
            >
                <div
                    style={{
                        color: 'rgba(0, 0, 0, 0.2)',
                        fontSize: `${8 * props.scale}rem`,
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        transform: 'rotate(-45deg)',
                        userSelect: 'none',
                    }}
                >
                    Draft
                </div>
            </div>
            {props.annotationLayer.children}
            {props.textLayer.children}
        </>
    ); 

    return (
        <ThemeContext.Provider value={themeContext}>
        <div
            style={{
                height: '925px',
            }}
        >
            <Viewer
                fileUrl={fileUrl}
                defaultScale={1.75}
                plugins={[highlightPluginInstance, defaultLayoutPluginInstance,themePluginInstance]}
                renderPage={renderPage}
                onDocumentLoad={handleDocumentLoad}
                theme={currentTheme}
            />
        </div>
        </ThemeContext.Provider>
    );
};

export default HighlightExample;