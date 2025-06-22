import React from 'react'

const AvtarGroup = ({ avatars, mxVisible }) => {
    return (
        <div className="flex items-center">
            {avatars.slice(0, mxVisible).map((avatar, index) => (
                <img
                    key={index}
                    src={avatar}
                    alt={`Avatar ${index}`}
                    className="w-9 h-9 rounded-full border-2 border-white -ml-3 first:ml-0 object-cover"
                />
            ))}

            {avatars.length > mxVisible && (
                <div className="w-9 h-9 flex items-center gap-3 justify-center text-sm font-medium rounded-full bg-gray-200 text-gray-700 border-2 border-white -ml-3">
                    +{avatars.length - mxVisible}
                </div>
            )}
        </div>
    )
}

export default AvtarGroup
