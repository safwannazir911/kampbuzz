/* The code snippet is a React component named `Banner` that takes a prop `src` and renders an image
element with the source set to the value of the `src` prop. The image is styled to be full width,
maintain its aspect ratio, and have rounded corners. The component will display the image specified
by the `src` prop. */
import React from 'react'

export const Banner = ({src}) => {
    return (
        <div className="mb-2">
            <img src={src} alt="" className="w-full h-auto object-cover rounded" />
        </div>
    )
}
