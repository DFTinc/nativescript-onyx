Pod::Spec.new do |s|
	s.name          				= 'OnyxCamera'
    s.version       				= '5.4.5'
    s.source       					= { :git => 'https://example.com', :tag => s.version.to_s }
    s.license       				= { :type => 'MIT' }
	s.summary       				= 'Onyx SDK CocoaPod for iOS.'
    s.homepage     					= 'http://www.diamondfortress.com'
    s.author       					= { 'mjwheatley' => 'mwheatley@diamondfortress.com' }
	s.ios.deployment_target   		= '8.0'
	s.platform      			    = :ios, '8.0'
	s.requires_arc       			= true 	
  	s.xcconfig						= { 'FRAMEWORK_SEARCH_PATHS' => '$(inherited)' }
  	s.pod_target_xcconfig        	= { 'ENABLE_BITCODE' => 'NO', 'OTHER_LDFLAGS' => '-lObjC' }
	s.ios.vendored_frameworks 		= 'OnyxCamera/Frameworks/*.framework' # OnyxCamera.framework
	# s.public_header_files 			= 'OnyxCamera/Headers/*.h' 
	# s.source_files 					= 'OnyxCamera/Classes/**/*.{h,m}'
	s.frameworks 					= 'CoreMedia', 'AVFoundation', 'AssetsLibrary'
  	s.resources             		= 'Resources/*.*' 
  	s.dependency					'OpenCV', '~> 3.4'
end 
