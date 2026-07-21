import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import SectionLabel from '../ui/SectionLabel'
import EditableText from '../editable/EditableText'
import EditableImage from '../editable/EditableImage'
import { useEditMode } from '../../contexts/EditModeContext'

// `onFieldChange` is optional — passed in by ServiceDetailPage when this
// service is backed by a live, editable content entry. Falls back to plain
// read-only rendering (used e.g. for a service that only exists in the
// bundled static defaults and hasn't been saved to the CMS yet).
const ServiceDetail = ({ service, onFieldChange }) => {
  const { editMode } = useEditMode()
  if (!service) return null

  const { name, description, icon, image, longDescription, highlights = [] } = service
  const canEdit = editMode && typeof onFieldChange === 'function'

  const updateHighlight = (i, text) => {
    const next = [...highlights]
    next[i] = text
    onFieldChange('highlights', next)
  }

  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
      <SectionLabel className="mb-4">Our services</SectionLabel>

      {(image || canEdit) && (
        <div className="relative rounded-2xl overflow-hidden aspect-[21/9] mb-10 bg-cream-dark">
          {canEdit ? (
            <EditableImage
              value={image}
              onChange={(v) => onFieldChange('image', v)}
              fallbackSrc={image}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <img src={image} alt={name} className="w-full h-full object-cover" />
          )}
        </div>
      )}

      <div className="flex items-start gap-5 mb-8">
        {icon && <span className="text-4xl">{icon}</span>}
        {canEdit ? (
          <EditableText
            as="h1"
            value={name}
            onChange={(v) => onFieldChange('name', v)}
            className="font-serif text-text-dark leading-tight"
            style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}
          />
        ) : (
          <h1
            className="font-serif text-text-dark leading-tight"
            style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}
          >
            {name}
          </h1>
        )}
      </div>

      {canEdit ? (
        <EditableText
          as="p"
          value={description}
          onChange={(v) => onFieldChange('description', v)}
          multiline
          className="font-sans text-text-body text-lg leading-relaxed mb-8"
        />
      ) : (
        <p className="font-sans text-text-body text-lg leading-relaxed mb-8">{description}</p>
      )}

      {(longDescription || canEdit) &&
        (canEdit ? (
          <EditableText
            as="p"
            value={longDescription || ''}
            onChange={(v) => onFieldChange('longDescription', v)}
            multiline
            className="font-sans text-text-body text-base leading-relaxed mb-8"
          />
        ) : (
          <p className="font-sans text-text-body text-base leading-relaxed mb-8">
            {longDescription}
          </p>
        ))}

      {(highlights.length > 0 || canEdit) && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mb-12">
          {highlights.map((item, i) => (
            <li key={i} className="flex items-center gap-2.5">
              <span className="text-forest text-sm">●</span>
              {canEdit ? (
                <EditableText
                  as="span"
                  value={item}
                  onChange={(v) => updateHighlight(i, v)}
                  className="font-sans text-sm text-text-body flex-1"
                />
              ) : (
                <span className="font-sans text-sm text-text-body">{item}</span>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap gap-4 pt-4 border-t border-cream-darker">
        <Link to="/book">
          <Button variant="primary" size="md">
            Book Here
          </Button>
        </Link>
        <Link to="/services">
          <Button variant="outline" size="md">
            All services
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default ServiceDetail