import { Divider, List } from 'antd'
import { useSubscription } from 'next/libs/global-state-hook'
import { ideaCount } from '../layout/header'
import { BlueColorButton } from 'next/components/custom-style-elements/button'
import IdeaCard from './idea-card'

function IdeasList({ ideas, loading, isEnd, loadMoreData }) {
  const {
    state: { number },
  } = useSubscription(ideaCount)
  const loadMore = (
    <>
      {!ideas?.length ? null : !isEnd && ideas?.length <= number ? (
        <div
          style={{
            textAlign: 'center',
            marginTop: 30,
          }}
        >
          <BlueColorButton onClick={loadMoreData} loading={loading}>
            Load more
          </BlueColorButton>
        </div>
      ) : (
        <Divider plain>It is all, nothing more 🤐</Divider>
      )}
    </>
  )

  return (
    <List
      loading={loading}
      loadMore={loadMore}
      itemLayout="vertical"
      size="large"
      dataSource={ideas}
      style={{
        marginBottom: '50px',
      }}
      renderItem={idea => <IdeaCard key={`${idea}`} idea={idea} isLoading={loading} />}
    />
  )
}

export default IdeasList
