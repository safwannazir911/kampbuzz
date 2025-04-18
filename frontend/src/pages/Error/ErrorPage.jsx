/**
 * The ErrorPage component in React displays a custom error message with a status code and a message on
 * a styled page.
 * @returns The `ErrorPage` component is being returned. It accepts two props: `status_code` and
 * `message`, and displays an error page with the provided status code and message. The page includes a
 * heading "Page not found", the error message, and a button to go back home.
 */
import React from 'react'
const ErrorPage = ({ status_code, message }) => {
    return (
        <>
            <main className="grid min-h-full h-screen place-items-center px-6 py-24 sm:py-32 lg:px-8 bg-gradient-to-r from-purple-200 to-pink-200">
                <div className="text-center ">
                    <p className="text-lg font-semibold text-indigo-600">{status_code}</p>
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Page not found</h1>
                    <p className="mt-6 text-lg leading-7 text-gray-600">{message}</p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <a
                            href="/"
                            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Go back home
                        </a>
                        {/* <a href="#" className="text-sm font-semibold text-gray-900">
                            Contact support <span aria-hidden="true">&rarr;</span>
                        </a> */}
                    </div>
                </div>
            </main>
        </>
    )
}

export default ErrorPage