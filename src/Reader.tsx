import React, { ReactElement } from 'react';
import {  RenderPage, RenderPageProps,Viewer, PageChangeEvent } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin, ToolbarProps, ToolbarSlot } from '@react-pdf-viewer/default-layout';
import { highlightPlugin } from '@react-pdf-viewer/highlight';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/highlight/lib/styles/index.css';

const ToolbarSlotsExample: React.FC<{}> = () => {
    const handlePageChange = (e: PageChangeEvent) => {
        localStorage.setItem('current-page', `${e.currentPage}`);
    };

    const initialPage:any = localStorage.getItem('current-page') ? localStorage.getItem('current-page') : 0;
    const renderToolbar = (Toolbar: (props: ToolbarProps) => ReactElement) => (
        <Toolbar>
            {(slots: ToolbarSlot) => {
                const {
                    CurrentPageInput,
                    Download,
                    EnterFullScreen,
                    GoToNextPage,
                    GoToPreviousPage,
                    NumberOfPages,
                    Print,
                    ShowSearchPopover,
                    Zoom,
                    ZoomIn,
                    ZoomOut,
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
                            <EnterFullScreen />
                        </div>
                        <div style={{ padding: '0px 2px' }}>
                            <Download />
                        </div>
                        <div style={{ padding: '0px 2px' }}>
                            <Print />
                        </div>
                    </div>
                );
            }}
        </Toolbar>
    );

    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        renderToolbar,
    });

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
                    Draft watermark
                </div>
            </div>
            {props.annotationLayer.children}
            {props.textLayer.children}
        </>
    ); 

    return (
        <div>
            
            <div style={{height:'900px'}}>
                <Viewer 
                    fileUrl={"https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf"} 
                    // fileUrl={newUrl} 
                    plugins={[defaultLayoutPluginInstance]} 
                    renderPage={renderPage}
                    defaultScale={1.7}
                    initialPage={initialPage} 
                    onPageChange={handlePageChange} 
                />
            </div>
        </div>
    )
};

export default ToolbarSlotsExample;