import SearchContainer from "@/components/search/SearchContainer";


interface PageProps {
  params: {
    search: string
  }
}

export default async function Home({params}: PageProps) {


  return (
    <>
        <SearchContainer search={params.search}/>
    </>
  )
}
