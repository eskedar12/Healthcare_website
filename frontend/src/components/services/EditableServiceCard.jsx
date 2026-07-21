import { Link } from 'react-router-dom'
import EditableText from '../editable/EditableText'
import EditableImage from '../editable/EditableImage'

// Same visual layout as ServiceCard's grid view, but swaps the whole-card
// <Link> (which would fight with clicking into a text/image field to edit
// it) for a small "View page →" link instead, and wires each field up to
// EditableText / EditableImage so admins can edit name, description, and
// picture directly from the live preview.
const EditableServiceCard = ({ service, onFieldChange }) => {
  return (
    <div className="group flex flex-col bg-cream-dark rounded-2xl shadow-card border border-forest/20 overflow-hidden">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-cream-dark">
        <EditableImage
          value={service.image}
          onChange={(v) => onFieldChange('image', v)}
          fallbackSrc={service.image}
          alt={service.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-3 px-6 pb-6 pt-3 flex-1">
        <span className="text-2xl">{service.icon}</span>
        <EditableText
          as="h3"
          value={service.name}
          onChange={(v) => onFieldChange('name', v)}
          className="font-serif text-lg text-text-dark"
        />
        <EditableText
          as="p"
          value={service.description}
          onChange={(v) => onFieldChange('description', v)}
          multiline
          className="font-sans text-sm text-text-body leading-relaxed flex-1"
        />
        <Link
          to={`/services/${service.slug}`}
          className="font-sans text-xs text-forest font-medium flex items-center gap-1 mt-auto"
        >
          View page <span>→</span>
        </Link>
      </div>
    </div>
  )
}

export default EditableServiceCard