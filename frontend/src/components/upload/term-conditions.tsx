import { Carousel, Modal } from 'antd'
const contentStyle: React.CSSProperties = {
  height: '50px',
  color: '#fff',
  lineHeight: '40px',
  textAlign: 'center',
  background: '#ccc',
}
export default function TermCondition({ isOpen, onCloseModal }) {
  const onFinish = async () => {
    onCloseModal()
  }

  return (
    <Modal
      open={isOpen}
      onCancel={() => {
        onCloseModal()
      }}
      title="Terms and Conditions"
      onOk={onFinish}
      destroyOnClose
    >
      <Carousel autoplay>
        <div>
          <h3 style={contentStyle}>1</h3>
          <p>
            CMS is a vast network of communities that are created, run, and populated by you, the CMS users. Through
            these communities, you can post, comment, vote, discuss, learn, debate, support, and connect with people who
            share your interests, and we encourage you to find—or even create—your home on CMS. While not every
            community may be for you (and you may find some unrelatable or even offensive), no community should be used
            as a weapon. Communities should create a sense of belonging for their members, not try to diminish it for
            others. Below the rules governing each community are the platform-wide rules that apply to everyone on CMS.
            These rules are enforced by us, the admins. CMS and its communities are only what we make of them together,
            and can only exist if we operate by a shared set of rules. We ask that you abide by not just the letter of
            these rules, but the spirit as well.
          </p>
        </div>
        <div>
          <h3 style={contentStyle}>2</h3>
          <p>
            Likewise, everyone on CMS should have an expectation of privacy and safety, so please respect the privacy
            and safety of others. Every community on CMS is defined by its users. Some of these users help manage the
            community as moderators. The culture of each community is shaped explicitly, by the community rules enforced
            by moderators, and implicitly, by the upvotes, downvotes, and discussions of its community members. Please
            abide by the rules of communities in which you participate and do not interfere with those in which you are
            not a member.
          </p>
        </div>
        <div>
          <h3 style={contentStyle}>Rules</h3>
          <p>
            Rule 1 Remember the human. CMS is a place for creating community and belonging, not for attacking
            marginalized or vulnerable groups of people. Everyone has a right to use CMS free of harassment,
            bullying, and threats of violence. Communities and users that incite violence or that promote hate based on
            identity or vulnerability will be banned. Rule 2 Abide by community rules. Post authentic content into
            communities where you have a personal interest, and do not cheat or engage in content manipulation
            (including spamming, vote manipulation, ban evasion, or subscriber fraud) or otherwise interfere with or
            disrupt CMS communities. Rule 3 Respect the privacy of others. Instigating harassment, for example by
            revealing someone’s personal or confidential information, is not allowed. Never post or threaten to post
            intimate or sexually-explicit media of someone without their consent. Rule 4 Do not post or encourage the
            posting of sexual or suggestive content involving minors. Rule 5 You don’t have to use your real name to use
            CMS, but don’t impersonate an individual or an entity in a misleading or deceptive manner.
          </p>
        </div>
      </Carousel>
    </Modal>
  )
}
