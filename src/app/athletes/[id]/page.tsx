'use client'

export default function Page({params}: {params: {id: string}}) {
    return (
        <h2>Page for user : {params.id}</h2>
    )
}